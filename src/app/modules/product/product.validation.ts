import { z } from "zod";

const createProductValidation = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
  details: z.string().optional(),
  basePrice: z.coerce.number({
    error: "Base price is required",
  }),
  discountPrice: z.coerce.number().optional(),
});

const updateProductValidation = z.object({
  name: z.string().min(1).optional(),
  description: z.array(z.string()).optional(),
  details: z.string().optional(),
  category: z.string().min(1).optional(),
  basePrice: z.coerce.number().min(0).optional(),
  discountPrice: z.coerce.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const ProductValidations = {
  createProductValidation,
  updateProductValidation,
};
