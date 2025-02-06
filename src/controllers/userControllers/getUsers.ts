import { Request, Response } from "express";
import { UserModel } from "../../models/userModels";
import { pagination } from "../../shared/helpers/pagination";
import { searchInModel } from "../../shared/helpers/searchInModel";

// Get users with pagination and dynamic search
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search_query, fields } = req.query;

    // Convert query params to numbers
    const currentPage = Number(page);
    const pageLimit = Number(limit);

    // Dynamically select fields to exclude (if any)
    const excludeFields = fields
      ? Array.isArray(fields)
        ? fields.map((field) => String(field))
        : [String(fields)]
      : ["password"];

    // Get total count of users (with search applied if necessary)
    const filter = search_query
      ? {
          $or: [
            { name: { $regex: search_query, $options: "i" } },
            { email: { $regex: search_query, $options: "i" } },
          ],
        }
      : {};
    const totalUsers = await UserModel.countDocuments(filter);

    // Apply search logic using searchInModel (without pagination applied yet)
    const users = await searchInModel(
      UserModel,
      search_query as string,
      ["name", "email", "role"], // Allow dynamic search on name, email, and role (you can expand this list)
      excludeFields
    );

    // Apply pagination (skip and limit) after fetching users
    const paginatedUsers = users.slice(
      (currentPage - 1) * pageLimit,
      currentPage * pageLimit
    ); // Slice the array to get paginated data

    // Use the paginate function to get pagination details
    const paginationData = pagination({
      page: currentPage,
      limit: pageLimit,
      totalItems: totalUsers,
    });

    res.json({
      success: true,
      data: paginatedUsers,
      meta: paginationData,
      message: "Users fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error fetching users", error: "Unknown error" });
    }
  }
};
