import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const rootRoutes = Router();

rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/users", userRoutes);

export default rootRoutes;
