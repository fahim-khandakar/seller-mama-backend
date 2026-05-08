import { z } from "zod";

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

  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Customer phone is required"),
  customerAddress: z.string().min(1, "Customer address is required"),
  customerEmail: z.string().email("Invalid email address"),

  transactionId: z.string().min(1, "Transaction ID is required"),

  paymentMethod: z
    .enum(["BKASH", "ROCKET", "NAGAD", "CARD", "CASH"])
    .optional()
    .default("CASH"),

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

export const OrderValidations = {
  createOrderValidation,
  updateOrderStatusValidation,
};
