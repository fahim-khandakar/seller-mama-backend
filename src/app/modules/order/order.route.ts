import express from "express";
import { OrderControllers } from "./order.controller";
import { validateRequest } from "../../../app/middlewares/validateRequest";
import { OrderValidations } from "./order.validation";
import { checkAuth } from "../../../app/middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/",
  // checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(OrderValidations.createOrderValidation),
  OrderControllers.createOrder,
);

router.get("/", OrderControllers.getAllOrders);

router.get("/:orderId", OrderControllers.getSingleOrder);

router.patch(
  "/:orderId/status",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(OrderValidations.updateOrderStatusValidation),
  OrderControllers.updateOrderStatus,
);
router.patch(
  "/:orderId",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(OrderValidations.updateOrderZodSchema),
  OrderControllers.updateOrder,
);
router.delete(
  "/:orderId",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  OrderControllers.deleteOrder,
);

export const OrderRoutes = router;
