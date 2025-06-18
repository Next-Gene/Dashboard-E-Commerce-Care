import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../../Enums/ApiEndpoint';
import {
  APISellerDataResponse,
  OrderStatusSummary,
  SellerDataRes,
  TopSellingProduct,
} from '../../interfaces/SellerDataRes';
@Injectable({
  providedIn: 'root',
})
export class SellerService {
  constructor(private _httpClient: HttpClient) {}

  // Dashboard
  getDashboardData(): Observable<SellerDataRes> {
    return this._httpClient.get<APISellerDataResponse>(
      ApiEndpoint.SELLER_DASHBOARD
    );
  }

  getTopSellingProducts(): Observable<TopSellingProduct[]> {
    return this._httpClient.get<TopSellingProduct[]>(
      ApiEndpoint.SELLER__top_selling_products
    );
  }
  getAvailableRoles(): Observable<string[]> {
    return this._httpClient.get<string[]>(ApiEndpoint.ADMIN_AVAILABLE_ROLES);
  }
  getOrderStatusSummary(): Observable<OrderStatusSummary> {
    return this._httpClient.get<OrderStatusSummary>(
      ApiEndpoint.SELLER__top_selling_products
    );
  }
}
