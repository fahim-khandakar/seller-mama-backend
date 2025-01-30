import { Router } from "express";
import userRoutes from "./userRoutes";

const rootRoutes = Router();

rootRoutes.use("/users", userRoutes);

export default rootRoutes;
