import { QueryBuilder } from "../../../utils/QueryBuilder";
import AppError from "../../../error helpers/AppError";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { categorySearchableFields } from "./category.constant";
import { deleteImageFromCLoudinary } from "../../../config/cloudinary.config";

const createCategory = async (
  payload: ICategory,
  file?: Express.Multer.File,
) => {
  if (file?.path) {
    payload.sizeChartImage = file.path;
  }
  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async (query: Record<string, string>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(categorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, meta] = await Promise.all([
    categoryQuery.modelQuery,
    categoryQuery.getMeta(),
  ]);

  return {
    meta,
    data,
  };
};

const getSingleCategory = async (id: string) => {
  const result = await Category.findById(id);

  if (!result) {
    throw new AppError(404, "Category not found!");
  }
  return result;
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>,
  file?: Express.Multer.File,
) => {
  const isExist = await Category.findById(id);

  if (!isExist) {
    throw new AppError(404, "Category not found!");
  }

  if (file?.path) {
    if (isExist.sizeChartImage) {
      await deleteImageFromCLoudinary(isExist.sizeChartImage);
    }
    payload.sizeChartImage = file.path;
  }

  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteCategory = async (id: string) => {
  const isExist = await Category.findById(id);

  if (!isExist) {
    throw new AppError(404, "Category not found!");
  }

  await Category.findByIdAndDelete(id);

  return null;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
