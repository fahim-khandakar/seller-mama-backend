import { Types } from "mongoose";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { productSearchableFields } from "./product.constant";
import { deleteImageFromCLoudinary } from "../../../config/cloudinary.config";
import AppError from "../../../error helpers/AppError";
import { MainCategory } from "../Main Category/mainCategory.model";
import { Category } from "../Category/category.model";
import { Type } from "../Type/type.model";

type CreateProductPayload = Omit<
  IProduct,
  "totalStock" | "createdBy" | "isActive" | "createdAt" | "updatedAt"
>;

const createProduct = async (
  payload: CreateProductPayload,
  userId: string,
  files: Express.Multer.File[],
) => {
  const imageUrls: string[] = files
    .map((file) => file.path)
    .filter((url) => url && typeof url === "string");

  if (imageUrls.length === 0) {
    throw new AppError(400, "Failed to upload images to Cloudinary");
  }
  const mainCategory = await MainCategory.findById(payload.mainCategory);
  if (!mainCategory) {
    throw new AppError(400, "Invalid main category");
  }
  payload.mainCategorySlug = mainCategory.slug;
  const category = await Category.findById(payload.category);
  if (!category) {
    throw new AppError(400, "Invalid category");
  }
  payload.categorySlug = category.slug;
  const type = await Type.findById(payload.type);
  if (!type) {
    throw new AppError(400, "Invalid type");
  }
  payload.typeSlug = type.slug;

  try {
    const product = await Product.create({
      ...payload,
      images: imageUrls,
      createdBy: new Types.ObjectId(userId),
    });

    return product;
  } catch (error) {
    // Rollback: Delete uploaded images if product creation fails
    for (const url of imageUrls) {
      try {
        await deleteImageFromCLoudinary(url);
      } catch (deleteError) {
        console.error("Error deleting image during rollback:", deleteError);
      }
    }
    throw error;
  }
};

const getAllProducts = async (query: Record<string, string>) => {
  const { minPrice, maxPrice, ...remainingQuery } = query;

  const filter: any = {};

  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }

  if (remainingQuery.category) {
    remainingQuery.categorySlug = remainingQuery.category;
    delete remainingQuery.category;
  }

  if (remainingQuery.mainCategory) {
    remainingQuery.mainCategorySlug = remainingQuery.mainCategory;
    delete remainingQuery.mainCategory;
  }
  if (remainingQuery.type) {
    remainingQuery.typeSlug = remainingQuery.type;
    delete remainingQuery.type;
  }

  const queryBuilder = new QueryBuilder(
    Product.find(filter).populate("mainCategory category type"),
    remainingQuery,
  );

  const productsData = queryBuilder
    .filter()
    .search(productSearchableFields)
    .sort()
    .paginate();

  const data = await productsData.build();
  const meta = await queryBuilder.getMeta();

  return { data, meta };
};

const getSingleProduct = async (id: string) => {
  const product = await Product.findById(id)
    .populate({
      path: "type",
    })
    .populate({
      path: "category",
    })
    .populate({
      path: "mainCategory",
    })
    .populate("createdBy", "name email");

  return { data: product };
};

const updateProduct = async (
  productId: string,
  payload: Partial<IProduct>,
  userId: string,
  files?: Express.Multer.File[],
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, "Product not found");
  }
  console.log("payload", payload);
  // Check authorization
  if (product.createdBy.toString() !== userId) {
    throw new AppError(401, "Unauthorized to update product");
  }

  let imageUrls = product.images || [];
  const oldImageUrls = [...imageUrls];

  try {
    // If new files are provided, replace old images
    if (files && files.length > 0) {
      imageUrls = files
        .map((file) => file.path)
        .filter((url) => url && typeof url === "string");

      if (imageUrls.length === 0) {
        throw new AppError(400, "Failed to upload new images to Cloudinary");
      }
    }

    const updatePayload = { ...payload };
    if (files && files.length > 0) {
      updatePayload.images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatePayload,
      {
        new: true,
        runValidators: true,
      },
    ).populate("createdBy", "name email");

    // Delete old images only if new images were uploaded successfully
    if (files && files.length > 0) {
      for (const oldUrl of oldImageUrls) {
        try {
          await deleteImageFromCLoudinary(oldUrl);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
    }

    return updatedProduct;
  } catch (error) {
    // Rollback: Delete newly uploaded images if update fails
    if (files && files.length > 0) {
      for (const url of imageUrls) {
        try {
          await deleteImageFromCLoudinary(url);
        } catch (deleteError) {
          console.error("Error deleting image during rollback:", deleteError);
        }
      }
    }
    throw error;
  }
};

const deleteProduct = async (productId: string, userId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(404, "Product not found");
  }

  if (product.createdBy.toString() !== userId) {
    throw new AppError(401, "Unauthorized to delete product");
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const imageUrl of product.images) {
      try {
        await deleteImageFromCLoudinary(imageUrl);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue deleting other images even if one fails
      }
    }
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
