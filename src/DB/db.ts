import mongoose from "mongoose";
import { DB_PASS, DB_USER } from "../shared/config/secrets";

export const connectDB = async () => {
  try {
    const mongoDB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.p0m1q4c.mongodb.net/seller_mama_ecommerce_DB?retryWrites=true&w=majority`;

    await mongoose
      .connect(mongoDB_URL)
      .then(() => console.log("✅ MongoDB Connected"))
      .catch((err) => console.error("Database connection error:", err));
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};
