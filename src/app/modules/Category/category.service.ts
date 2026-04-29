import { QueryBuilder } from "../../../utils/QueryBuilder";
import AppError from "../../../error helpers/AppError";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { categorySearchableFields } from "./category.constant";

const createCategory = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async (query: Record<string, string>) => {
  const categoryQuery = new QueryBuilder(
    Category.find().populate("mainCategory"),
    query,
  )
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
  const result = await Category.findById(id).populate("mainCategory");

  if (!result) {
    throw new AppError(404, "Category not found!");
  }
  return result;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const isExist = await Category.findById(id);

  if (!isExist) {
    throw new AppError(404, "Category not found!");
  }

  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("mainCategory");

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
