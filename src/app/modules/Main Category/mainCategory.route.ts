import express from "express";
import { MainCategoryControllers } from "./mainCategory.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { MainCategoryValidations } from "./mainCategory.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(MainCategoryValidations.createMainCategoryValidation),
  MainCategoryControllers.createMainCategory,
);

router.get("/", MainCategoryControllers.getAllMainCategories);

router.get("/:id", MainCategoryControllers.getSingleMainCategory);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(MainCategoryValidations.updateMainCategoryValidation),
  MainCategoryControllers.updateMainCategory,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  MainCategoryControllers.deleteMainCategory,
);

export const MainCategoryRoutes = router;
