import { Injectable } from '@angular/core';
import { APISellerDataResponse, SellerDataRes } from '../interfaces/SellerDataRes';

@Injectable({
  providedIn: 'root'
})
export class SellerDataAdapter {
  SellerDataAdapter(res: APISellerDataResponse): SellerDataRes {
    return {
      totalOrders: res.totalOrders,
      totalRevenue: res.totalRevenue,
      orderStatusSummary: res.orderStatusSummary,
      topSellingProducts: res.topSellingProducts,
      monthlyRevenue: res.monthlyRevenue,
      averageOrder: res.averageOrder,
      avgProcessingTime: res.avgProcessingTime,
      avgItemsPerOrder: res.avgItemsPerOrder,
      pendingOrdersPercent: res.pendingOrdersPercent,
      rejectRate: res.rejectRate,
    };
  }
}

