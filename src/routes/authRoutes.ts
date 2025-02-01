import { Router } from "express";
import { login } from "../controllers/auth/login";
import authMiddleware from "../middlewares/auth";
import { me } from "../controllers/auth/checkUser";

const authRoutes: Router = Router();

authRoutes.post("/signin", login).get("/me", [authMiddleware], me);

export default authRoutes;
