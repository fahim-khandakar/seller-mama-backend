import { Model } from "mongoose";

/**
 * Common search function for MongoDB collections
 * @param model - Mongoose Model (e.g., UserModel)
 * @param searchQuery - The search term from req.query
 * @param fields - Array of fields to search in (e.g., ["name", "email"])
 * @param excludeFields - Array of fields to exclude from the result (e.g., ["password"])
 * @returns Filtered data based on the search query
 */
export const searchInModel = async (
  model: Model<any>,
  searchQuery: string | undefined,
  fields: string[],
  excludeFields: string[] = []
) => {
  let filter = {};

  // If there's a search query, build the filter based on fields
  if (searchQuery) {
    filter = {
      $or: fields.map((field) => ({
        [field]: { $regex: searchQuery, $options: "i" },
      })),
    };
  }

  // Convert exclude fields array to a string for select()
  const exclude = excludeFields.map((field) => `-${field}`).join(" ");

  // Return the filtered data, excluding specified fields
  return model.find(filter).select(exclude);
};
