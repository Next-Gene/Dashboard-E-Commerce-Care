import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = `${environment.apiUrl}/seller`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/summary`);
  }

  getDailyRevenue(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/daily-revenue`);
  }

  getTopSellingProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/top-products`);
  }
} 