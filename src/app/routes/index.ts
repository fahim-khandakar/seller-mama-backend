import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProductRoutes } from "../modules/product/product.route";
import { OrderRoutes } from "../modules/order/order.route";
import { MainCategoryRoutes } from "../modules/Main Category/mainCategory.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { TypeRoutes } from "../modules/Type/type.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/main-categories",
    route: MainCategoryRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/types",
    route: TypeRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
