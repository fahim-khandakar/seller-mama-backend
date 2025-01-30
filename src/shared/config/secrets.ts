import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
