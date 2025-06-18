export interface SellerDataRes {
  totalOrders: number;
  totalRevenue: number;
  orderStatusSummary: OrderStatusSummary;
  topSellingProducts: TopSellingProduct[];
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
  quantitySold: number;
  revenue: number;
  price: number;
  photoUrl: string;
}

export interface MonthlyRevenue {
  period: string;
  revenue: number;
  orderCount: number;
}
export type APISellerDataResponse = SellerDataRes;
