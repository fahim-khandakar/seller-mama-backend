import { Router } from "express";
import { getUsers } from "../controllers/userControllers/getUsers";
import { createUser } from "../controllers/userControllers/createUser";
import { deleteUser } from "../controllers/userControllers/deleteUser";
import { getSingleUser } from "../controllers/userControllers/getSingleUser";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/adminMiddleware";
import { editUser } from "../controllers/userControllers/editUser";
import { createUserByAdmin } from "../controllers/userControllers/createUserByAdmin";
import { verifyEmail } from "../controllers/userControllers/utilities/email.verify";
import { resendMail } from "../controllers/userControllers/resendMail";

const userRoutes = Router();

userRoutes
  .get("/", [authMiddleware, adminMiddleware], getUsers)
  .post("/", createUser)
  .post("/email-verify", verifyEmail)
  .post("/resent-mail-verify", resendMail)
  .delete("/:id", [authMiddleware, adminMiddleware], deleteUser)
  .get("/:id", [authMiddleware, adminMiddleware], getSingleUser)
  .patch("/:id", [authMiddleware], editUser)
  .post(
    "/create-by-admin",
    [authMiddleware, adminMiddleware],
    createUserByAdmin
  );

export default userRoutes;
