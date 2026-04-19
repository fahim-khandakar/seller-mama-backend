import { Types } from "mongoose";

export interface IAnalyticsSummary {
  _id: string | null;
  totalSales: number;
  totalProfit: number;
  totalQuantity: number;
  totalOrders: number;
  totalProducts: number;
  averageSellPrice?: number;
}
