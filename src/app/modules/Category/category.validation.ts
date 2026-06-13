import { z } from "zod";

const createCategoryValidation = z.object({
  name: z
    .string({
      error: "Name is required",
    })
    .min(1),

  slug: z.string({
    error: "Slug is required",
  }),
});

const updateCategoryValidation = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
});

export const CategoryValidations = {
  createCategoryValidation,
  updateCategoryValidation,
};
