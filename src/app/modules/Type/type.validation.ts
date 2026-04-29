import { z } from "zod";

const createTypeValidation = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string({
    error: "Slug is required",
  }),
});

const updateTypeValidation = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
});

export const TypeValidations = {
  createTypeValidation,
  updateTypeValidation,
};
