import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../../Enums/ApiEndpoint ';
import { changeRoleApi } from '../../interfaces/change-role';
import { DashboardDataRes, OrderStatusSummary, TopSellingProduct } from '../../interfaces/DashboardDataRes';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardData(): Observable<DashboardDataRes> {
    return this.http.get<DashboardDataRes>(ApiEndpoint.ADMIN_DASHBOARD);
  }

  getTopSellingProducts(): Observable<TopSellingProduct[]> {
    return this.http.get<TopSellingProduct[]>(ApiEndpoint.ADMIN_top_selling_products);
  }

  getOrderStatusSummary(): Observable<OrderStatusSummary> {
    return this.http.get<OrderStatusSummary>(ApiEndpoint.ADMIN_order_status_summary);
  }

  // User Management
  changeUserRole(data: changeRoleApi): Observable<any> {
    return this.http.put(ApiEndpoint.ADMIN_CHANGE_ROLE, data);
  }

  getAvailableRoles(): Observable<string[]> {
    return this.http.get<string[]>(ApiEndpoint.ADMIN_AVAILABLE_ROLES);
  }
} 