import { z } from "zod";

const createCategoryValidation = z.object({
  name: z
    .string({
      error: "Name is required",
    })
    .min(1),

  mainCategory: z.string({
    error: "Main Category ID is required",
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    mainCategory: z.string().optional(),
  }),
});

export const CategoryValidations = {
  createCategoryValidation,
  updateCategoryValidation,
};
