import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name should have at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password should have at least 6 characters"),
});
