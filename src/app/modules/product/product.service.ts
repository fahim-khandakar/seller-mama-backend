import { Types } from "mongoose";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { productSearchableFields } from "./product.constant";

type CreateProductPayload = Omit<
  IProduct,
  "stock" | "totalStock" | "createdBy" | "isActive" | "createdAt" | "updatedAt"
> & {
  stock: { quantity: number; purchasePrice: number }[];
};

const createProduct = async (payload: CreateProductPayload, userId: string) => {
  // Calculate remainingQuantity for each stock entry
  const stock = payload.stock.map((entry) => ({
    ...entry,
    purchaseDate: new Date(),
    remainingQuantity: entry.quantity,
  }));

  const product = await Product.create({
    ...payload,
    stock,
    createdBy: new Types.ObjectId(userId),
  });

  return product;
};

const addStock = async (
  productId: string,
  stockEntry: { quantity: number; purchasePrice: number },
  userId: string,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Check if user is authorized (only creator or admin can add stock)
  if (product.createdBy.toString() !== userId) {
    // TODO: Add role check for admin/superadmin
    throw new Error("Unauthorized to add stock");
  }

  const newStockEntry = {
    quantity: stockEntry.quantity,
    purchasePrice: stockEntry.purchasePrice,
    purchaseDate: new Date(),
    remainingQuantity: stockEntry.quantity,
  };

  product.stock.push(newStockEntry);
  await product.save();

  return product;
};

const getProductStockHistory = async (productId: string) => {
  const product = await Product.findById(productId).select(
    "name stock totalStock",
  );
  if (!product) {
    throw new Error("Product not found");
  }

  return {
    productId: product._id,
    name: product.name,
    totalStock: product.totalStock,
    stock: product.stock.sort(
      (a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime(),
    ),
  };
};

const getProductStockSummary = async (productId: string) => {
  const product = await Product.findById(productId).select("stock totalStock");
  if (!product) {
    throw new Error("Product not found");
  }

  const totalPurchasedQuantity = product.stock.reduce(
    (sum, entry) => sum + entry.quantity,
    0,
  );
  const totalPurchaseValue = product.stock.reduce(
    (sum, entry) => sum + entry.quantity * entry.purchasePrice,
    0,
  );
  const averagePurchasePrice =
    totalPurchasedQuantity > 0
      ? totalPurchaseValue / totalPurchasedQuantity
      : 0;
  const latestPurchaseDate = product.stock
    .map((entry) => entry.purchaseDate)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return {
    productId: product._id,
    currentStock: product.totalStock,
    totalPurchasedQuantity,
    totalPurchaseValue,
    averagePurchasePrice,
    batchCount: product.stock.length,
    latestPurchaseDate,
  };
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
  addStock,
  getProductStockHistory,
  getProductStockSummary,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
