import express from "express";
import { AnalyticsControllers } from "./analytics.controller";
import { checkAuth } from "../../../app/middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.get(
  "/summary",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  AnalyticsControllers.getSummary,
);

export const AnalyticsRoutes = router;
