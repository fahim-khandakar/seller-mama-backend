import express from "express";
import { ProductControllers } from "./product.controller";
import { validateRequest } from "../../../app/middlewares/validateRequest";
import { ProductValidations } from "./product.validation";
import { checkAuth } from "../../../app/middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(ProductValidations.createProductValidation),
  ProductControllers.createProduct,
);

router.post(
  "/:productId/stock",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(ProductValidations.addStockValidation),
  ProductControllers.addStock,
);

router.get("/", ProductControllers.getAllProducts);

router.get("/:productId", ProductControllers.getSingleProduct);

router.get(
  "/:productId/stock-history",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  ProductControllers.getProductStockHistory,
);

router.get(
  "/:productId/stock-summary",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  ProductControllers.getProductStockSummary,
);

router.patch(
  "/:productId",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(ProductValidations.updateProductValidation),
  ProductControllers.updateProduct,
);

router.delete(
  "/:productId",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
