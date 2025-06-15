export interface DashboardDataRes {
    totalOrders: number
    totalRevenue: number
    orderStatusSummary: OrderStatusSummary
    topSellingProducts: TopSellingProduct[]
    dailyRevenue: DailyRevenue[]
    monthlyRevenue: MonthlyRevenue[]
  }
  
  export interface OrderStatusSummary {
    pendingOrders: number
    processingOrders: number
    completedOrders: number
    cancelledOrders: number
    pendingRevenue: number
    processingRevenue: number
    completedRevenue: number
  }
  
  export interface TopSellingProduct {
    productId: number
    productName: string
    category: string
    brand: string
    totalQuantitySold: number
    totalRevenue: number
    photoUrl: string
  }
  
  export interface DailyRevenue {
    period: string
    revenue: number
    orderCount: number
  }
  
  export interface MonthlyRevenue {
    period: string
    revenue: number
    orderCount: number
  }
  