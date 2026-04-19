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

    // Process each item and decrement stock
    for (const item of payload.items || []) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      if (product.totalStock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      let remainingQuantity = item.quantity;
      const stockEntries = product.stock.sort(
        (a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime(),
      ); // FIFO

      for (const entry of stockEntries) {
        if (remainingQuantity <= 0) break;

        const deduct = Math.min(remainingQuantity, entry.remainingQuantity);
        entry.remainingQuantity -= deduct;
        remainingQuantity -= deduct;

        processedItems.push({
          product: item.product,
          quantity: deduct,
          sellPrice: item.sellPrice,
          stockEntry: entry._id,
          purchasePrice: entry.purchasePrice,
        });

        totalAmount += deduct * item.sellPrice;
      }

      // Update product stock
      await product.save({ session });
    }

    const finalAmount = totalAmount - (payload.discountAmount || 0);

    const order = await Order.create(
      [
        {
          ...payload,
          items: processedItems,
          totalAmount,
          finalAmount,
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
