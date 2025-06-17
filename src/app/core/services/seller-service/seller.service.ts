import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../../Enums/ApiEndpoint ';
import { DashboardDataRes, TopSellingProduct } from '../../interfaces/DashboardDataRes';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardData(): Observable<DashboardDataRes> {
    return this.http.get<DashboardDataRes>(ApiEndpoint.SELLER_DASHBOARD);
  }

  getTopSellingProducts(): Observable<TopSellingProduct[]> {
    return this.http.get<TopSellingProduct[]>(ApiEndpoint.SELLER__top_selling_products);
  }

  getDailyRevenue(): Observable<DashboardDataRes['dailyRevenue']> {
    return this.http.get<DashboardDataRes['dailyRevenue']>(ApiEndpoint.SELLER_DAILY_REVENUE);
  }
} 