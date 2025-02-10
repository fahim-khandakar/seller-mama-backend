import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";

const rootRoutes = Router();

rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/users", userRoutes);
rootRoutes.use("/products", productRoutes);

export default rootRoutes;
