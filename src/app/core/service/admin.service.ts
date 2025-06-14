import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/summary`);
  }

  getOrderStatusSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/order-status`);
  }

  getTopSellingProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/top-products`);
  }
} 