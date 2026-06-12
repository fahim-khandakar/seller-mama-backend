import { Types } from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { orderSearchableFields } from "./order.constant";
import { ENUM_ORDER_STATUS, TOrderStatus } from "../../../enums/order";
import { validateCoupon } from "../coupon/coupon.utils";
import { Coupon } from "../coupon/coupon.model";
import AppError from "../../../error helpers/AppError";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";

/**
 * 🔹 Create Types
 */
type CreateOrderItemInput = {
  product: string;
  quantity: number;
  sellPrice: number;
  nameAndNumber?: string;
};

type CreateOrderPayload = Omit<
  IOrder,
  "items" | "status" | "soldBy" | "totalAmount" | "finalAmount" | "coupon"
> & {
  items: CreateOrderItemInput[];
  deliveryCharge: number;
};

/**
 * 🔹 Create Order
 */
const createOrder = async (
  payload: CreateOrderPayload & { coupon?: string },
  userId?: string, // ✅ optional করা হলো
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
      nameAndNumber?: string;
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
        nameAndNumber: item.nameAndNumber || "",
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
    const orderPayload: any = {
      ...payload,
      items: processedItems,
      totalAmount: totalAmount + payload.deliveryCharge,
      discountAmount: discount,
      finalAmount: finalAmount + payload.deliveryCharge,
      status: ENUM_ORDER_STATUS.PENDING,
      soldBy: userId || undefined,
    };

    const order = await Order.create([orderPayload], { session });

    /**
     * 💥 INCREMENT COUPON USAGE
     */
    if (couponDoc && discount > 0) {
      await Coupon.findByIdAndUpdate(
        couponDoc._id,
        { $inc: { usedCount: 1 } },
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
    .populate("items", "nameAndNumber")
    .populate("items.product", "name category basePrice discountPrice images")
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

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true },
  )
    .populate("items.product", "name category")
    .populate("soldBy", "name email");

  return updatedOrder;
};

const updateOrder = async (orderId: string, payload: Partial<IOrder>) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  // Optional: prevent critical field overwrite (security)
  const blockedFields = ["_id", "transactionId", "soldBy"];
  blockedFields.forEach((field) => {
    if (field in payload) {
      delete (payload as any)[field];
    }
  });

  // Update fields dynamically
  Object.keys(payload).forEach((key) => {
    (order as any)[key] = (payload as any)[key];
  });

  await order.save();

  return order;
};

const deleteOrder = async (orderId: string, userId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(404, "Order not found");
  }

  const isAdmin = await User.findById(userId).select("role");

  if (!isAdmin) {
    throw new AppError(404, "User not found");
  }

  if (isAdmin.role !== Role.SUPER_ADMIN) {
    throw new AppError(403, "Forbidden: Only SUPER_ADMIN can delete orders");
  }

  await Order.findByIdAndDelete(orderId);
  return { message: "Order deleted successfully" };
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  updateOrder,
};
