import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
