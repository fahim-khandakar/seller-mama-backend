import { Types } from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { orderSearchableFields } from "./order.constant";
import { ENUM_ORDER_STATUS, TOrderStatus } from "../../../enums/order";
import { validateCoupon } from "../coupon/coupon.utils";
import { Coupon } from "../coupon/coupon.model";

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
  "items" | "status" | "soldBy" | "totalAmount" | "finalAmount" | "coupon"
> & {
  items: CreateOrderItemInput[];
};

/**
 * 🔹 Create Order
 */
const createOrder = async (
  payload: CreateOrderPayload & { coupon?: string },
  userId: string,
) => {
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

      totalAmount += item.quantity * item.sellPrice;

      processedItems.push({
        product: new Types.ObjectId(item.product),
        quantity: item.quantity,
        sellPrice: item.sellPrice,
      });
    }

    /**
     * 💥 COUPON LOGIC
     */
    let discount = 0;

    let couponDoc = null;

    if (payload.coupon) {
      const result = await validateCoupon(payload.coupon, totalAmount);

      discount = result.discount;
      couponDoc = result.couponId;
    }

    if (discount < 0) {
      throw new Error("Invalid discount");
    }

    if (discount > totalAmount) {
      discount = totalAmount;
    }

    const finalAmount = totalAmount - discount;

    /**
     * 💥 CREATE ORDER
     */
    const order = await Order.create(
      [
        {
          ...payload,
          items: processedItems,
          totalAmount,
          discountAmount: discount,
          finalAmount,
          soldBy: new Types.ObjectId(userId),
          status: ENUM_ORDER_STATUS.PENDING,
        },
      ],
      { session },
    );

    /**
     * 💥 INCREMENT COUPON USAGE (IMPORTANT)
     */
    if (couponDoc && discount > 0) {
      await Coupon.findByIdAndUpdate(
        couponDoc._id,
        {
          $inc: { usedCount: 1 },
        },
        { session },
      );
    }

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
