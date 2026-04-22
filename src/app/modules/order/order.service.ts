import { Types } from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { orderSearchableFields } from "./order.constant";

type CreateOrderItemInput = {
  product: string;
  quantity: number;
  sellPrice: number;
};

type CreateOrderPayload = Omit<
  IOrder,
  "items" | "status" | "soldBy" | "totalAmount" | "finalAmount"
> & {
  items: CreateOrderItemInput[];
};

const createOrder = async (payload: CreateOrderPayload, userId: string) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const processedItems: any[] = [];

    for (const item of payload.items || []) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      // No stock checking anymore

      totalAmount += item.quantity * item.sellPrice;

      processedItems.push({
        product: item.product,
        quantity: item.quantity,
        sellPrice: item.sellPrice,
      });
    }

    const finalAmount = totalAmount - (payload.discountAmount || 0);

    const order = await Order.create(
      [
        {
          ...payload,
          items: processedItems,
          totalAmount,
          finalAmount,
          status: "Pending", // default দিলে safe
          soldBy: new Types.ObjectId(userId),
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllOrders = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Order.find()
      .populate("items.product", "name category")
      .populate("soldBy", "name email"),
    query,
  );

  const ordersData = queryBuilder
    .filter()
    .search(orderSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    ordersData.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleOrder = async (id: string) => {
  const order = await Order.findById(id)
    .populate("items.product", "name category basePrice discountPrice")
    .populate("soldBy", "name email");
  return { data: order };
};

const updateOrderStatus = async (
  orderId: string,
  status: string,
  userId: string,
) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Check if user is authorized (only seller or admin can update)
  if (order.soldBy.toString() !== userId) {
    // TODO: Add role check for admin/superadmin
    throw new Error("Unauthorized to update order");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true },
  )
    .populate("items.product", "name category")
    .populate("soldBy", "name email");

  return updatedOrder;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
};
