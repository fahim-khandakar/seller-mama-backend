import { Types } from "mongoose";
import { Order } from "../order/order.model";

const getSummary = async (query: Record<string, string>) => {
  const { startDate, endDate, soldBy, product, groupBy } = query;

  const match: any = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  if (soldBy) match.soldBy = new Types.ObjectId(soldBy);
  if (product) match["items.product"] = new Types.ObjectId(product);

  let groupId: any = null;
  if (groupBy === "user") {
    groupId = "$soldBy";
  } else if (groupBy === "product") {
    groupId = "$items.product";
  } else if (groupBy === "day") {
    groupId = {
      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
    };
  } else if (groupBy === "month") {
    groupId = {
      $dateToString: { format: "%Y-%m", date: "$createdAt" },
    };
  }

  const pipeline: any[] = [
    { $match: match },
    { $unwind: "$items" },
    {
      $group: {
        _id: groupId,
        totalSales: {
          $sum: { $multiply: ["$items.sellPrice", "$items.quantity"] },
        },
        totalProfit: {
          $sum: {
            $multiply: [
              { $subtract: ["$items.sellPrice", "$items.purchasePrice"] },
              "$items.quantity",
            ],
          },
        },
        totalQuantity: { $sum: "$items.quantity" },
        totalOrders: { $addToSet: "$_id" },
        totalProducts: { $addToSet: "$items.product" },
        averageSellPrice: { $avg: "$items.sellPrice" },
      },
    },
    {
      $project: {
        _id: 1,
        totalSales: 1,
        totalProfit: 1,
        totalQuantity: 1,
        totalOrders: { $size: "$totalOrders" },
        totalProducts: { $size: "$totalProducts" },
        averageSellPrice: 1,
      },
    },
    { $sort: { totalSales: -1 } },
  ];

  const result = await Order.aggregate(pipeline);
  return result;
};

export const AnalyticsServices = {
  getSummary,
};
