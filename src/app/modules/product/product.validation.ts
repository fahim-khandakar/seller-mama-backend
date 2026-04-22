import { z } from "zod";

const createProductValidation = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
  basePrice: z.number().min(0, "Base price must be positive"),
  discountPrice: z.number().min(0).optional(),
  merchantPrice: z.number().min(0, "Merchant price must be positive"),
});

const updateProductValidation = z.object({
  name: z.string().min(1).optional(),
  description: z.array(z.string()).optional(),
  category: z.string().min(1).optional(),
  basePrice: z.number().min(0).optional(),
  discountPrice: z.number().min(0).optional(),
  merchantPrice: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const ProductValidations = {
  createProductValidation,
  updateProductValidation,
};
