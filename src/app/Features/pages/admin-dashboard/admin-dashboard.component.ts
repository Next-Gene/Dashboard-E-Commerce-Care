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
  
  // Enhanced data structures with colors
  orderTime = [
    { label: 'Afternoon', percent: 40, color: '#3B82F6' },
    { label: 'Evening',   percent: 32, color: '#06B6D4' },
    { label: 'Morning',   percent: 28, color: '#6366F1' },
  ];
  
  ratings = [
    { label: 'Hygiene',    percent: 85, color: '#10B981' },
    { label: 'Food Taste', percent: 85, color: '#F59E0B' },
    { label: 'Packaging',  percent: 92, color: '#EF4444' },
  ];

  // Chart instances for proper cleanup
  private revenueChart: Chart | null = null;
  private orderTimeChart: Chart | null = null;
  private orderLineChart: Chart | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // Wait for data to arrive before drawing charts
    const interval = setInterval(() => {
      if (this.dashboardData && this.dashboardData.dailyRevenue?.length > 0) {
        clearInterval(interval);
        this.initializeCharts();
      }
    }, 100);

    // Clear interval after 5 seconds to prevent infinite waiting
    setTimeout(() => {
      clearInterval(interval);
    }, 5000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up chart instances
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.orderTimeChart) {
      this.orderTimeChart.destroy();
    }
    if (this.orderLineChart) {
      this.orderLineChart.destroy();
    }
  }

  private initializeCharts(): void {
    this.createRevenueChart();
    this.createOrderTimeChart();
    this.createOrderLineChart();
  }

  private createRevenueChart(): void {
    const ctx = document.getElementById('reviewBarChart') as HTMLCanvasElement;
    if (!ctx || !this.dashboardData?.dailyRevenue) return;

    const gradient = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
    if (gradient) {
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
    }

    this.revenueChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dashboardData.dailyRevenue.map(d => d.period),
        datasets: [{
          label: 'Revenue',
          data: this.dashboardData.dailyRevenue.map(d => d.revenue),
          backgroundColor: gradient || '#3B82F6',
          borderColor: '#3B82F6',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: '#2563EB',
          hoverBorderColor: '#1D4ED8',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#3B82F6',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Revenue: EGP ${context.parsed.y.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              },
              callback: function(value) {
                return 'EGP ' + value.toLocaleString();
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  private createOrderTimeChart(): void {
    const ctx = document.getElementById('orderTimePieChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.orderTimeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.orderTime.map(o => o.label),
        datasets: [{
          data: this.orderTime.map(o => o.percent),
          backgroundColor: this.orderTime.map(o => o.color),
          borderColor: '#fff',
          borderWidth: 3,
          hoverBorderColor: '#fff',
          hoverBorderWidth: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1.5,
        cutout: '65%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#3B82F6',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  }

  private createOrderLineChart(): void {
    const ctx = document.getElementById('orderLineChart') as HTMLCanvasElement;
    if (!ctx || !this.dashboardData?.dailyRevenue) return;

    const gradient = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
    if (gradient) {
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0.0)');
    }

    this.orderLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dashboardData.dailyRevenue.map(d => d.period),
        datasets: [{
          label: 'Orders',
          data: this.dashboardData.dailyRevenue.map(d => d.orderCount),
          borderColor: '#9333EA',
          backgroundColor: gradient || 'rgba(147, 51, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#9333EA',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#7C3AED',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#9333EA',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Orders: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.topSellingProducts = data.topSellingProducts;
        this.loading = false;
        
        // Reinitialize charts after data loads with a small delay
        setTimeout(() => {
          if (this.dashboardData && this.dashboardData.dailyRevenue?.length > 0) {
            this.initializeCharts();
          }
        }, 200);
      },
      error: (error) => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
        console.error('Dashboard data loading error:', error);
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

  // Helper methods for enhanced functionality
  getAverageOrderValue(): number {
    if (!this.dashboardData || this.dashboardData.totalOrders === 0) {
      return 0;
    }
    return this.dashboardData.totalRevenue / this.dashboardData.totalOrders;
  }

  getRevenueGrowth(): number {
    return this.dashboardData?.monthlyRevenue?.[0]?.revenue || 2.1;
  }

  getOrderGrowth(): number {
    return this.dashboardData?.dailyRevenue?.[0]?.orderCount || 2.1;
  }

  // Method to refresh charts (useful for responsive design)
  refreshCharts(): void {
    if (this.dashboardData && this.dashboardData.dailyRevenue?.length > 0) {
      // Clean up existing charts
      if (this.revenueChart) {
        this.revenueChart.destroy();
        this.revenueChart = null;
      }
      if (this.orderTimeChart) {
        this.orderTimeChart.destroy();
        this.orderTimeChart = null;
      }
      if (this.orderLineChart) {
        this.orderLineChart.destroy();
        this.orderLineChart = null;
      }
      
      // Reinitialize charts
      this.initializeCharts();
    }
  }
}
