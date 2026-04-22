import { Types } from "mongoose";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { productSearchableFields } from "./product.constant";

type CreateProductPayload = Omit<
  IProduct,
  "totalStock" | "createdBy" | "isActive" | "createdAt" | "updatedAt"
>;

const createProduct = async (payload: CreateProductPayload, userId: string) => {
  const product = await Product.create({
    ...payload,
    createdBy: new Types.ObjectId(userId),
  });

  return product;
};

const getAllProducts = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Product.find().populate("createdBy", "name email"),
    query,
  );

  const productsData = queryBuilder
    .filter()
    .search(productSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    productsData.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleProduct = async (id: string) => {
  const product = await Product.findById(id).populate(
    "createdBy",
    "name email",
  );
  return { data: product };
};

const updateProduct = async (
  productId: string,
  payload: Partial<IProduct>,
  userId: string,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Check authorization
  if (product.createdBy.toString() !== userId) {
    // TODO: Add role check
    throw new Error("Unauthorized to update product");
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email");

  return updatedProduct;
};

const deleteProduct = async (productId: string, userId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (product.createdBy.toString() !== userId) {
    throw new Error("Unauthorized to delete product");
  }

  await Product.findByIdAndDelete(productId);
  return { message: "Product deleted successfully" };
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
