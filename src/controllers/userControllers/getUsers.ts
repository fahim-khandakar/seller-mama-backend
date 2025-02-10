import { Request, Response } from "express";
import { UserModel } from "../../models/userModels";
import { pagination } from "../../shared/helpers/pagination";

// Get users with pagination and dynamic search
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search_query, fields } = req.query;

    // Convert query params to numbers
    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    // Dynamically exclude fields (default: password)
    const excludeFields = fields
      ? Array.isArray(fields)
        ? fields.map((field) => String(field))
        : [String(fields)]
      : ["password"];

    // Apply search logic using searchInModel
    const filter = search_query
      ? {
          $or: [
            { name: { $regex: search_query, $options: "i" } },
            { email: { $regex: search_query, $options: "i" } },
            { role: { $regex: search_query, $options: "i" } },
          ],
        }
      : {};

    // Get total count
    const totalUsers = await UserModel.countDocuments(filter);

    // Fetch users with search, pagination, and excluding fields
    const users = await UserModel.find(filter)
      .select(excludeFields.map((field) => `-${field}`).join(" ")) // Exclude fields dynamically
      .skip(skip)
      .limit(pageLimit);

    // Use pagination helper
    const paginationData = pagination({
      page: currentPage,
      limit: pageLimit,
      totalItems: totalUsers,
    });

    res.json({
      success: true,
      data: users,
      meta: paginationData,
      message: "Users fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
