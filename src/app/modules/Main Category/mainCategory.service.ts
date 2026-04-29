import { QueryBuilder } from "../../../utils/QueryBuilder";
import AppError from "../../../error helpers/AppError";
import { IMainCategory } from "./mainCategory.interface";
import { MainCategory } from "./mainCategory.model";

const mainCategorySearchableFields = ["name", "description"];

const createMainCategory = async (payload: IMainCategory) => {
  const result = await MainCategory.create(payload);
  return result;
};

const getAllMainCategories = async (query: Record<string, string>) => {
  const mainCategoryQuery = new QueryBuilder(MainCategory.find(), query)
    .search(mainCategorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, meta] = await Promise.all([
    mainCategoryQuery.modelQuery,
    mainCategoryQuery.getMeta(),
  ]);

  return {
    meta,
    data,
  };
};

const getSingleMainCategory = async (id: string) => {
  const result = await MainCategory.findById(id);
  if (!result) {
    throw new AppError(404, "Main Category not found!");
  }
  return result;
};

const updateMainCategory = async (
  id: string,
  payload: Partial<IMainCategory>,
) => {
  const isExist = await MainCategory.findById(id);

  if (!isExist) {
    throw new AppError(404, "Main Category not found!");
  }

  const result = await MainCategory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteMainCategory = async (id: string) => {
  const isExist = await MainCategory.findById(id);

  if (!isExist) {
    throw new AppError(404, "Main Category not found!");
  }

  await MainCategory.findByIdAndDelete(id);

  return null;
};

export const MainCategoryServices = {
  createMainCategory,
  getAllMainCategories,
  getSingleMainCategory,
  updateMainCategory,
  deleteMainCategory,
};
