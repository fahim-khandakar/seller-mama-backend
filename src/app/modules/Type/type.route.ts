import express from "express";
import { TypeControllers } from "./type.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { TypeValidations } from "./type.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(TypeValidations.createTypeValidation),
  TypeControllers.createType,
);

router.get("/", TypeControllers.getAllTypes);

router.get("/:id", TypeControllers.getSingleType);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  validateRequest(TypeValidations.updateTypeValidation),
  TypeControllers.updateType,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN),
  TypeControllers.deleteType,
);

export const TypeRoutes = router;
