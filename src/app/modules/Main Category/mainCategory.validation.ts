import { z } from "zod";

const createMainCategoryValidation = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
});

const updateMainCategoryValidation = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
});

export const MainCategoryValidations = {
  createMainCategoryValidation,
  updateMainCategoryValidation,
};
