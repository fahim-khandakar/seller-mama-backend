import { Router } from "express";
import { getUsers } from "../controllers/userControllers/getUsers";
import { createUser } from "../controllers/userControllers/createUser";
import { deleteUser } from "../controllers/userControllers/deleteUser";
import { getSingleUser } from "../controllers/userControllers/getSingleUser";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/adminMiddleware";
import { me } from "../controllers/auth/checkUser";

const userRoutes = Router();

userRoutes
  .get("/", [authMiddleware, adminMiddleware], getUsers)
  .post("/", createUser)
  .delete("/:id", [authMiddleware, adminMiddleware], deleteUser)
  .get("/:id", [authMiddleware, adminMiddleware], getSingleUser);

export default userRoutes;
