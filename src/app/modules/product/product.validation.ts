import { z } from "zod";

const addStockValidation = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  purchasePrice: z.number().min(0, "Purchase price must be positive"),
});

const createProductValidation = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  basePrice: z.number().min(0, "Base price must be positive"),
  discountPrice: z.number().min(0).optional(),
  stock: z
    .array(addStockValidation)
    .min(1, "At least one stock entry required"),
});

const updateProductValidation = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  basePrice: z.number().min(0).optional(),
  discountPrice: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const ProductValidations = {
  createProductValidation,
  updateProductValidation,
  addStockValidation,
};
