import { QueryBuilder } from "../../../utils/QueryBuilder";
import AppError from "../../../error helpers/AppError";
import { IType } from "./type.interface";
import { Type } from "./type.model";
import { typeSearchableFields } from "./type.constant";

const createType = async (payload: IType) => {
  const result = await Type.create(payload);
  return result;
};

const getAllTypes = async (query: Record<string, string>) => {
  const typeQuery = new QueryBuilder(Type.find(), query)
    .search(typeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, meta] = await Promise.all([
    typeQuery.modelQuery,
    typeQuery.getMeta(),
  ]);

  return {
    meta,
    data,
  };
};

const getSingleType = async (id: string) => {
  const result = await Type.findById(id);
  if (!result) {
    throw new AppError(404, "Type not found!");
  }
  return result;
};

const updateType = async (id: string, payload: Partial<IType>) => {
  const isExist = await Type.findById(id);

  if (!isExist) {
    throw new AppError(404, "Type not found!");
  }

  const result = await Type.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteType = async (id: string) => {
  const isExist = await Type.findById(id);

  if (!isExist) {
    throw new AppError(404, "Type not found!");
  }

  await Type.findByIdAndDelete(id);

  return null;
};

export const TypeServices = {
  createType,
  getAllTypes,
  getSingleType,
  updateType,
  deleteType,
};
