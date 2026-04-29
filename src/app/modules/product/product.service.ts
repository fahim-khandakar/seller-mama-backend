import { Types } from "mongoose";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { productSearchableFields } from "./product.constant";
import {
  uploadBufferToCloudinary,
  deleteImageFromCLoudinary,
} from "../../../config/cloudinary.config";
import AppError from "../../../error helpers/AppError";

type CreateProductPayload = Omit<
  IProduct,
  "totalStock" | "createdBy" | "isActive" | "createdAt" | "updatedAt"
>;

const createProduct = async (
  payload: CreateProductPayload,
  userId: string,
  files: Express.Multer.File[],
) => {
  // Files are already uploaded to Cloudinary by multer
  // Just collect the URLs
  const imageUrls: string[] = files
    .map((file) => file.path)
    .filter((url) => url && typeof url === "string");

  if (imageUrls.length === 0) {
    throw new AppError(400, "Failed to upload images to Cloudinary");
  }

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
  const { minPrice, maxPrice, mainCategory, category, ...remainingQuery } =
    query;

  // 1. Price Range logic build kora
  const priceFilter: any = {};
  if (minPrice || maxPrice) {
    priceFilter.basePrice = {};
    if (minPrice) priceFilter.basePrice.$gte = Number(minPrice);
    if (maxPrice) priceFilter.basePrice.$lte = Number(maxPrice);
  }

  // 2. Initial Query Build (With Price Filter)
  let productQuery = Product.find(priceFilter)
    .populate({
      path: "type",
      populate: {
        path: "category",
        populate: {
          path: "mainCategory",
        },
      },
    })
    .populate("createdBy", "name email");

  // 3. QueryBuilder initialize kora
  const queryBuilder = new QueryBuilder(productQuery, remainingQuery);

  // 4. Execution
  const productsData = queryBuilder
    .filter() // Baaki field (like type ID) eikhan diye filter hobe
    .search(productSearchableFields)
    .sort()
    .fields()
    .paginate();

  let data = await productsData.build();

  // 5. MainCategory ebong Category diye Manual Filtering
  // Karon e gulo deeply nested, QueryBuilder direct database level-e nested populate filter korte pare na
  if (mainCategory || category) {
    data = data.filter((product: any) => {
      const matchCategory = category
        ? product.type?.category?._id.toString() === category
        : true;

      const matchMainCategory = mainCategory
        ? product.type?.category?.mainCategory?._id.toString() === mainCategory
        : true;

      return matchCategory && matchMainCategory;
    });
  }

  const meta = await queryBuilder.getMeta();

  return { data, meta };
};

const getSingleProduct = async (id: string) => {
  const product = await Product.findById(id)
    .populate({
      path: "type",
      populate: {
        path: "category",
        populate: {
          path: "mainCategory",
        },
      },
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
