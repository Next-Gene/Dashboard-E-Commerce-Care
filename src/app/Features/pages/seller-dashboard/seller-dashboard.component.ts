import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { SellerDataRes, TopSellingProduct } from '../../../core/interfaces/SellerDataRes';
import {
  OrderStatusSummary,
} from '../../../core/interfaces/SellerDataRes';
import { SellerService } from '../../../core/services/seller-service/seller.service';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss'],
})
export class SellerDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  
  dashboardData: SellerDataRes | null = null;
  orderStatusSummary: OrderStatusSummary | null = null;
  topSellingProducts: TopSellingProduct[] = [];
  availableRoles: string[] = [];
  loading = true;
  error: string | null = null;
  
  // Enhanced data structures with colors
  orderTime = [
    { label: 'Afternoon', percent: 40, color: '#10B981' },
    { label: 'Evening', percent: 60, color: '#3B82F6' },
    { label: 'Morning', percent: 0, color: '#8B5CF6' },
  ];

  // Chart instances for proper cleanup
  private reviewChart: Chart | null = null;
  private orderTimeChart: Chart | null = null;
  private orderLineChart: Chart | null = null;

  @ViewChild('reviewChartCanvas') reviewChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orderTimeCanvas') orderTimeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orderLineCanvas') orderLineCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private _sellerService: SellerService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Wait for data to arrive before drawing charts
    const interval = setInterval(() => {
      if (this.dashboardData && this.dashboardData.monthlyRevenue?.length > 0) {
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
    if (this.reviewChart) {
      this.reviewChart.destroy();
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
  if (!this.reviewChartCanvas?.nativeElement || !this.dashboardData?.monthlyRevenue) return;

  // ✅ Destroy existing chart if it exists
  if (this.reviewChart) {
    this.reviewChart.destroy();
    this.reviewChart = null;
  }

  const ctx = this.reviewChartCanvas.nativeElement;
  const gradient = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
  if (gradient) {
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
  }

  this.reviewChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: this.dashboardData.monthlyRevenue.map((d) => d.period),
      datasets: [
        {
          label: 'Revenue',
          data: this.dashboardData.monthlyRevenue.map((d) => d.revenue),
          backgroundColor: gradient || '#10B981',
          borderColor: '#10B981',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: '#059669',
          hoverBorderColor: '#047857',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#10B981',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `Revenue: EGP ${context.parsed.y.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12,
            },
          },
        },
        y: {
          grid: {
            color: '#E5E7EB',
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12,
            },
            callback: function (value) {
              return 'EGP ' + value.toLocaleString();
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    },
  });
}


  private createOrderTimeChart(): void {
    if (!this.orderTimeCanvas?.nativeElement) return;

    const ctx = this.orderTimeCanvas.nativeElement;

    this.orderTimeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.orderTime.map((o) => o.label),
        datasets: [
          {
            data: this.orderTime.map((o) => o.percent),
            backgroundColor: this.orderTime.map((o) => o.color),
            borderColor: '#fff',
            borderWidth: 3,
            hoverBorderColor: '#fff',
            hoverBorderWidth: 4,
          },
        ],
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
            borderColor: '#10B981',
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
    if (!this.orderLineCanvas?.nativeElement || !this.dashboardData?.monthlyRevenue) return;

    const ctx = this.orderLineCanvas.nativeElement;
    const gradient = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 400);
    if (gradient) {
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    }

    this.orderLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dashboardData.monthlyRevenue.map((d) => d.period),
        datasets: [
          {
            label: 'Orders',
            data: this.dashboardData.monthlyRevenue.map((d) => d.orderCount),
            borderColor: '#3B82F6',
            backgroundColor: gradient || 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#2563EB',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 4,
          },
        ],
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

    this._sellerService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.topSellingProducts = data.topSellingProducts;
          this.loading = false;

          // Reinitialize charts after data loads with a small delay
          setTimeout(() => {
            if (this.dashboardData && this.dashboardData.monthlyRevenue?.length > 0) {
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
    return this.dashboardData?.monthlyRevenue?.[0]?.orderCount || 2.1;
  }

  // Method to refresh charts (useful for responsive design)
  refreshCharts(): void {
    if (this.dashboardData && this.dashboardData.monthlyRevenue?.length > 0) {
      // Clean up existing charts
      if (this.reviewChart) {
        this.reviewChart.destroy();
        this.reviewChart = null;
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

