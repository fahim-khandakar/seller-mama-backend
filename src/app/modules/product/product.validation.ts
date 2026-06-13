import { z } from "zod";

const createProductValidation = z.object({
  name: z.string({ error: "Name is required" }).min(1),
  description: z.array(z.string()).optional(),
  details: z.string().optional(),

  basePrice: z.coerce.number({ error: "Base price is required" }).min(0),
  discountPrice: z.coerce.number().min(0).optional(),
  totalStock: z.coerce.number().min(0).optional(),

  // Product validation schema (Backend)
  isActive: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val === "true") return true;
      if (val === "false") return false;
    }
    return val;
  }, z.boolean().optional().default(true)),

  type: z.string({ error: "Type ID is required" }),
  category: z.string({ error: "Category ID is required" }),
  mainCategory: z.string({ error: "Main Category ID is required" }),
  sizeChartImage: z.string().optional(),
});

const updateProductValidation = z.object({
  name: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.array(z.string()).optional(),
  details: z.string().optional(),
  basePrice: z.coerce.number().min(0).optional(),
  discountPrice: z.coerce.number().min(0).optional(),
  totalStock: z.coerce.number().min(0).optional(),
  isActive: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val === "true") return true;
      if (val === "false") return false;
    }
    return val;
  }, z.boolean().optional().default(true)),
  type: z.string().optional(),
  category: z.string().optional(),
  mainCategory: z.string().optional(),
  sizeChartImage: z.string().optional(),
});

export const ProductValidations = {
  createProductValidation,
  updateProductValidation,
};
