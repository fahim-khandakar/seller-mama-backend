import { z } from "zod";

const orderItemValidation = z.object({
  product: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  sellPrice: z.number().min(0, "Sell price must be positive"),
});

const createOrderValidation = z.object({
  items: z.array(orderItemValidation).min(1, "At least one item required"),
  discountAmount: z.number().min(0).optional(),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
});

const updateOrderStatusValidation = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export const OrderValidations = {
  createOrderValidation,
  updateOrderStatusValidation,
};
