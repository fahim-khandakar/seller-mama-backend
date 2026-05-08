import { Router } from "express";
import { UserControllers } from "./coupon.controller";
import { Role } from "./coupon.interface";
import { updateUserZodSchema } from "./coupon.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/register",
  // validateRequest(createUserZodSchema),
  UserControllers.createUser,
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers,
);
router.get(
  "/all-customers",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllCustomers,
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser,
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser,
);

// /api/v1/user/:id
export const UserRoutes = router;
