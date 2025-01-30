import { Router } from "express";
import { getUsers } from "../controllers/userControllers/getUsers";
import { createUser } from "../controllers/userControllers/createUser";
import { deleteUser } from "../controllers/userControllers/deleteUser";
import { getSingleUser } from "../controllers/userControllers/getSingleUser";

const userRoutes = Router();

userRoutes
  .get("/", getUsers)
  .post("/", createUser)
  .delete("/:id", deleteUser)
  .get("/:id", getSingleUser);

export default userRoutes;
