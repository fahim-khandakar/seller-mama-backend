import { z } from "zod";

const createTypeValidation = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string({
    error: "Category ID is required",
  }),
});

const updateTypeValidation = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(),
});

export const TypeValidations = {
  createTypeValidation,
  updateTypeValidation,
};
