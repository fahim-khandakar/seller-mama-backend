import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/adminMiddleware";
import { getProducts } from "../controllers/productControllers/getProducts";
import { createProduct } from "../controllers/productControllers/createProduct";
import { deleteProduct } from "../controllers/productControllers/deleteProduct";
import { getSingleProduct } from "../controllers/productControllers/getSingleProduct";
import { editProduct } from "../controllers/productControllers/editProduct";

const productRoutes = Router();

productRoutes
  .get("/", getProducts)
  .post("/", [authMiddleware, adminMiddleware], createProduct)
  .delete("/:id", [authMiddleware, adminMiddleware], deleteProduct)
  .get("/:id", getSingleProduct)
  .patch("/:id", [authMiddleware], editProduct);

export default productRoutes;
