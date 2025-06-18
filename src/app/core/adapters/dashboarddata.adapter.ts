import { Injectable } from '@angular/core';
import {
  APIDashboardDataResponse,
  DashboardDataRes,
} from '../interfaces/DashboardDataRes';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataAdapter {
  constructor() {}
  DashboardDataAdapter(res: APIDashboardDataResponse): DashboardDataRes {
    return {
      totalOrders: res.totalOrders,
      totalRevenue: res.totalRevenue,
      orderStatusSummary: res.orderStatusSummary,
      topSellingProducts: res.topSellingProducts,
      dailyRevenue: res.dailyRevenue,
      monthlyRevenue: res.monthlyRevenue,
      averageOrder: res.averageOrder,
      avgProcessingTime: res.avgProcessingTime,
      avgItemsPerOrder: res.avgItemsPerOrder,
      pendingOrdersPercent: res.pendingOrdersPercent,
      rejectRate: res.rejectRate,
    };
  }
}
