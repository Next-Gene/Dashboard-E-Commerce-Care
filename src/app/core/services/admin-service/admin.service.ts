import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../../Enums/ApiEndpoint';
import { changeRoleApi } from '../../interfaces/change-role';
import {
  DailyRevenue,
  DashboardDataRes,
  MonthlyRevenue,
  OrderStatusSummary,
  TopSellingProduct,
} from '../../interfaces/DashboardDataRes';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private _httpClient: HttpClient) {}

  // Dashboard
  getDashboardData(): Observable<DashboardDataRes> {
    return this._httpClient.get<DashboardDataRes>(ApiEndpoint.ADMIN_DASHBOARD);
  }

  getTopSellingProducts(): Observable<TopSellingProduct[]> {
    return this._httpClient.get<TopSellingProduct[]>(
      ApiEndpoint.ADMIN_top_selling_products
    );
  }

  getOrderStatusSummary(): Observable<OrderStatusSummary> {
    return this._httpClient.get<OrderStatusSummary>(
      ApiEndpoint.ADMIN_order_status_summary
    );
  }
  getDailyRevenue(): Observable<DailyRevenue[]> {
    return this._httpClient.get<DailyRevenue[]>(ApiEndpoint.ADMIN_DASHBOARD);
  }
  getMonthlyRevenue(): Observable<MonthlyRevenue[]> {
    return this._httpClient.get<MonthlyRevenue[]>(ApiEndpoint.ADMIN_DASHBOARD);
  }

  // User Management
  changeUserRole(data: changeRoleApi): Observable<any> {
    return this._httpClient.put(ApiEndpoint.ADMIN_CHANGE_ROLE, data);
  }

  getAvailableRoles(): Observable<string[]> {
    return this._httpClient.get<string[]>(ApiEndpoint.ADMIN_AVAILABLE_ROLES);
  }
}
