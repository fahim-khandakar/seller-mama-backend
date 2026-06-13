import express from "express";
import { CategoryControllers } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { CategoryValidations } from "./category.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../../config/multer.config";

const router = express.Router();

// Create Category - Under a Main Category
router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  multerUpload.single("sizeChartImage"),
  validateRequest(CategoryValidations.createCategoryValidation),
  CategoryControllers.createCategory,
);

// Get All Categories (with optional ?mainCategory=ID filter)
router.get("/", CategoryControllers.getAllCategories);

// Get Single Category
router.get("/:id", CategoryControllers.getSingleCategory);

// Update Category
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  multerUpload.single("sizeChartImage"),
  validateRequest(CategoryValidations.updateCategoryValidation),
  CategoryControllers.updateCategory,
);

// Delete Category
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
