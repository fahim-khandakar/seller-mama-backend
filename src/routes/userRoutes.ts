import { Router } from "express";
import { getUsers } from "../controllers/userControllers/getUsers";
import { createUser } from "../controllers/userControllers/createUser";

const userRoutes = Router();

userRoutes.get("/", getUsers).post("/", createUser);

export default userRoutes;
