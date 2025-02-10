import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  stock: z
    .number()
    .int()
    .min(0, "Stock must be a non-negative integer")
    .default(0),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  brand: z.string().optional(),
  createdBy: z.string().min(1, "Created by is required"),
});
