export interface DashboardDataRes {
  totalOrders: number;
  totalRevenue: number;
  orderStatusSummary: OrderStatusSummary;
  topSellingProducts: TopSellingProduct[];
  dailyRevenue: DailyRevenue[];
  monthlyRevenue: MonthlyRevenue[];
  averageOrder: number;
  avgProcessingTime: number;
  avgItemsPerOrder: number;
  pendingOrdersPercent: number;
  rejectRate: number;
}

export interface OrderStatusSummary {
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  shipping: number;
  pickups: number;
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  category: string;
  brand: string;
  totalQuantitySold: number;
  totalRevenue: number;
  photoUrl: string;
}

export interface DailyRevenue {
  period: string;
  revenue: number;
  orderCount: number;
}

export interface MonthlyRevenue {
  period: string;
  revenue: number;
  orderCount: number;
}
export type APIDashboardDataResponse = DashboardDataRes;
