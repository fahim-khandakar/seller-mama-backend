import express from "express";
import { ProductControllers } from "./product.controller";
import { validateRequest } from "../../../app/middlewares/validateRequest";
import { ProductValidations } from "./product.validation";
import { checkAuth } from "../../../app/middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../../config/multer.config";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  multerUpload.array("products", 10),
  validateRequest(ProductValidations.createProductValidation),
  ProductControllers.createProduct,
);

router.get("/", ProductControllers.getAllProducts);

router.get("/:productId", ProductControllers.getSingleProduct);

router.patch(
  "/:productId",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  multerUpload.array("products", 10),
  validateRequest(ProductValidations.updateProductValidation),
  ProductControllers.updateProduct,
);

router.delete(
  "/:productId",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
