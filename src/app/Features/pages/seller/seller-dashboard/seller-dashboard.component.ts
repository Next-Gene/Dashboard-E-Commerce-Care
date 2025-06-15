import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SellerService } from '../../../../core/service/seller-service/seller.service';
import { DashboardDataRes, TopSellingProduct } from '../../../../core/interfaces/DashboardDataRes';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss']
})
export class SellerDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dashboardData: DashboardDataRes | null = null;
  topSellingProducts: TopSellingProduct[] = [];
  dailyRevenue: DashboardDataRes['dailyRevenue'] = [];
  loading = true;
  error: string | null = null;

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadTopSellingProducts();
    this.loadDailyRevenue();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.sellerService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load dashboard data';
          this.loading = false;
          console.error('Dashboard data error:', error);
        }
      });
  }

  private loadTopSellingProducts(): void {
    this.sellerService.getTopSellingProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.topSellingProducts = products;
        },
        error: (error) => {
          console.error('Top selling products error:', error);
        }
      });
  }

  private loadDailyRevenue(): void {
    this.sellerService.getDailyRevenue()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (revenue) => {
          this.dailyRevenue = revenue;
        },
        error: (error) => {
          console.error('Daily revenue error:', error);
        }
      });
  }

  getMaxRevenue(): number {
    if (!this.dailyRevenue.length) return 0;
    return Math.max(...this.dailyRevenue.map(day => day.revenue));
  }
} 