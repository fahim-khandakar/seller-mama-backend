import { z } from "zod";
import { ENUM_ORDER_STATUS } from "../../../enums/order";

/**
 * 🔹 Order Item Validation
 */
const orderItemValidation = z.object({
  product: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  sellPrice: z.number().min(0, "Sell price must be positive"),
  purchasePrice: z.number().min(0).optional(),
  nameAndNumber: z.string().optional(),
});

/**
 * 🔹 Create Order Validation
 */
const createOrderValidation = z.object({
  items: z.array(orderItemValidation).min(1, "At least one item required"),

  totalAmount: z.number().min(0, "Total amount must be positive"),

  discountAmount: z.number().min(0).optional().default(0),

  finalAmount: z.number().min(0, "Final amount must be positive"),
  paidAmount: z.number().min(0, "Final amount must be positive"),
  deliveryCharge: z.number().min(0, "Final amount must be positive"),

  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Customer phone is required"),
  customerAddress: z.string().min(1, "Customer address is required"),
  customerEmail: z.string().email("Invalid email address").optional(),

  transactionId: z.string().min(1, "Transaction ID is required"),

  paymentMethod: z
    .enum(["BKASH", "ROCKET", "NAGAD", "CARD", "CASH"])
    .optional()
    .default("BKASH"),

  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "IN_PROGRESS",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional()
    .default("PENDING"),

  soldBy: z.string().optional(),
  coupon: z.string().optional(),
});

/**
 * 🔹 Update Order Status Validation
 */
const updateOrderStatusValidation = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export const updateOrderZodSchema = z.object({
  items: z.array(orderItemValidation).optional(),

  totalAmount: z.number().min(0).optional(),
  discountAmount: z.number().min(0).optional(),
  finalAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),

  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  customerAddress: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),

  transactionId: z.string().optional(),

  paymentMethod: z
    .enum(["BKASH", "ROCKET", "NAGAD", "CARD", "CASH"])
    .optional(),

  status: z.enum(ENUM_ORDER_STATUS).optional(),
});

export const OrderValidations = {
  createOrderValidation,
  updateOrderStatusValidation,
  updateOrderZodSchema,
};
