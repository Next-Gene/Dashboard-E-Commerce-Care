import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../core/services/admin-service/admin.service';
import {
  DashboardDataRes,
  OrderStatusSummary,
  TopSellingProduct,
} from '../../../core/interfaces/DashboardDataRes';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  dashboardData: DashboardDataRes | null = null;
  orderStatusSummary: OrderStatusSummary | null = null;
  topSellingProducts: TopSellingProduct[] = [];
  availableRoles: string[] = [];
  loading = true;
  error: string | null = null;
  orderTime = [
    { label: 'Afternoon', percent: 40 },
    { label: 'Evening',   percent: 32 },
    { label: 'Morning',   percent: 28 },
  ];
  ratings = [
    { label: 'Hygiene',    percent: 85 },
    { label: 'Food Taste', percent: 85 },
    { label: 'Packaging',  percent: 92 },
  ];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }
  ngAfterViewInit() {
    // Wait for data to arrive before drawing charts
    const interval = setInterval(() => {
      if (this.dashboardData) {
        clearInterval(interval);

        // Review Bar Chart
        new Chart('reviewBarChart', {
          type: 'bar',
          data: {
            labels: this.dashboardData.dailyRevenue.map(d => d.period),
            datasets: [{
              label: 'Revenue',
              data: this.dashboardData.dailyRevenue.map(d => d.revenue),
              backgroundColor: '#5bb8ff'
            }]
          },
          options: { maintainAspectRatio: false }
        });

        // Order Time Pie Chart
        new Chart('orderTimePieChart', {
          type: 'doughnut',
          data: {
            labels: this.orderTime.map(o => o.label),
            datasets: [{
              data: this.orderTime.map(o => o.percent),
              backgroundColor: ['#0070CD','#5BB8FF','#00366A']
            }]
          },
          options: { maintainAspectRatio: false, cutout: '60%' }
        });

        // Order Line Chart
        new Chart('orderLineChart', {
          type: 'line',
          data: {
            labels: this.dashboardData.dailyRevenue.map(d => d.period),
            datasets: [{
              label: 'Orders',
              data: this.dashboardData.dailyRevenue.map(d => d.orderCount),
              borderColor: '#5BB8FF',
              fill: false
            }]
          },
          options: { maintainAspectRatio: false }
        });
      }
    }, 100);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.topSellingProducts = data.topSellingProducts;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      },
    });
  }

  private loadTopSellingProducts(): void {
    this.adminService
      .getTopSellingProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.topSellingProducts = products;
        },
        error: (error) => {
          console.error('Top selling products error:', error);
        },
      });
  }

  private loadOrderStatusSummary(): void {
    this.adminService
      .getOrderStatusSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary) => {
          this.orderStatusSummary = summary;
        },
        error: (error) => {
          console.error('Order status summary error:', error);
        },
      });
  }

  private loadAvailableRoles(): void {
    this.adminService
      .getAvailableRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles) => {
          this.availableRoles = roles;
        },
        error: (error) => {
          console.error('Available roles error:', error);
        },
      });
  }

  changeUserRole(email: string, newRole: string): void {
    this.adminService
      .changeUserRole({ email, newRole })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Refresh dashboard data after role change
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Change role error:', error);
        },
      });
  }
}
