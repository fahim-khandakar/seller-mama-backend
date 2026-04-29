import { z } from "zod";

const createProductValidation = z.object({
  name: z.string({ error: "Name is required" }).min(1),
  category: z.string({ error: "Category is required" }).min(1),
  description: z.array(z.string()).optional(),
  details: z.string().optional(),

  basePrice: z.coerce.number({ error: "Base price is required" }).min(0),
  discountPrice: z.coerce.number().min(0).optional(),
  totalStock: z.coerce.number().min(0).optional(),

  isActive: z.boolean().optional(),

  type: z.string({ error: "Type ID is required" }),
});

const updateProductValidation = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.array(z.string()).optional(),
  details: z.string().optional(),
  basePrice: z.coerce.number().min(0).optional(),
  discountPrice: z.coerce.number().min(0).optional(),
  totalStock: z.coerce.number().min(0).optional(),
  isActive: z.boolean().optional(),
  type: z.string().optional(),
});

export const ProductValidations = {
  createProductValidation,
  updateProductValidation,
};
