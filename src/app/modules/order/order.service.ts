import { Types } from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { orderSearchableFields } from "./order.constant";
import { ENUM_ORDER_STATUS, TOrderStatus } from "../../../enums/order";

/**
 * 🔹 Create Types
 */
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

/**
 * 🔹 Create Order
 */
const createOrder = async (payload: CreateOrderPayload, userId: string) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    if (!payload.items?.length) {
      throw new Error("At least one order item is required");
    }

    let totalAmount = 0;
    const processedItems: {
      product: Types.ObjectId;
      quantity: number;
      sellPrice: number;
    }[] = [];

    for (const item of payload.items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }

      if (item.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      if (item.sellPrice < 0) {
        throw new Error("Sell price cannot be negative");
      }

      totalAmount += item.quantity * item.sellPrice;

      processedItems.push({
        product: new Types.ObjectId(item.product),
        quantity: item.quantity,
        sellPrice: item.sellPrice,
      });
    }

    const discount = payload.discountAmount ?? 0;

    if (discount < 0) {
      throw new Error("Discount cannot be negative");
    }

    if (discount > totalAmount) {
      throw new Error("Discount cannot be greater than total amount");
    }

    const finalAmount = totalAmount - discount;

    const order = await Order.create(
      [
        {
          ...payload,
          items: processedItems,
          totalAmount,
          finalAmount,
          soldBy: new Types.ObjectId(userId),
          status: ENUM_ORDER_STATUS.PENDING, // ✅ using enum
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

/**
 * 🔹 Get All Orders
 */
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

/**
 * 🔹 Get Single Order
 */
const getSingleOrder = async (id: string) => {
  const order = await Order.findById(id)
    .populate("items.product", "name category basePrice discountPrice")
    .populate("soldBy", "name email");

  if (!order) {
    throw new Error("Order not found");
  }

  return { data: order };
};

/**
 * 🔹 Update Order Status
 */
const updateOrderStatus = async (
  orderId: string,
  status: TOrderStatus,
  userId: string,
) => {
  // extra safety check (optional)
  if (!Object.values(ENUM_ORDER_STATUS).includes(status)) {
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (!order.soldBy || order.soldBy.toString() !== userId) {
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
