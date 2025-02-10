import { Request, Response } from "express";
import { ProductModel } from "../../models/productModel";
import { pagination } from "../../shared/helpers/pagination";

// Get products with pagination and search
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search_query, fields, category } = req.query;

    // Convert query params to numbers
    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    // Dynamically exclude fields (default: none)
    const excludeFields = fields
      ? Array.isArray(fields)
        ? fields.map((field) => String(field))
        : [String(fields)]
      : [];

    // Apply search filter
    const filter: any = {};

    if (search_query) {
      filter.$or = [
        { name: { $regex: search_query, $options: "i" } },
        { description: { $regex: search_query, $options: "i" } },
        { category: { $regex: search_query, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    // Get total count
    const totalProducts = await ProductModel.countDocuments(filter);

    // Fetch products with search, pagination, and excluding fields
    const products = await ProductModel.find(filter)
      .select(excludeFields.map((field) => `-${field}`).join(" ")) // Exclude fields dynamically
      .skip(skip)
      .limit(pageLimit);

    // Use pagination helper
    const paginationData = pagination({
      page: currentPage,
      limit: pageLimit,
      totalItems: totalProducts,
    });

    res.json({
      success: true,
      data: products,
      meta: paginationData,
      message: "Products fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching products: ", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
