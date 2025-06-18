import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AdminService } from '../../../core/services/admin-service/admin.service';
import {
  OrderStatusSummary,
  TopSellingProduct,
  DailyRevenue,
  MonthlyRevenue,
} from '../../../core/interfaces/DashboardDataRes';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, NgClass, PaginationComponent],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  topSellingProducts: TopSellingProduct[] = [];
  orderStatusSummary: OrderStatusSummary | null = null;
  dailyRevenue: DailyRevenue[] = [];
  monthlyRevenue: MonthlyRevenue[] = [];
  averageOrder = 0;
  totalRevenue = 0;
  totalOrders = 0;
  completedPercent = 0;
  cancelledPercent = 0;
  orders: {
    id: number;
    customer: string;
    status: string;
    product: TopSellingProduct;
    total: number;
    date: string;
  }[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  revenueChart: Chart | null = null;
  ordersStatusChart: Chart | null = null;
  Math: any = Math;
paginatedOrders: typeof this.orders = [];
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboardData().subscribe((res) => {
      this.totalOrders = res.totalOrders;
      this.totalRevenue = res.totalRevenue;
      this.averageOrder = this.totalRevenue / this.totalOrders;
      this.orderStatusSummary = res.orderStatusSummary;

      const total = res.totalOrders;
      this.completedPercent = Math.round((res.orderStatusSummary.completedOrders / total) * 100);
      this.cancelledPercent = Math.round((res.orderStatusSummary.cancelledOrders / total) * 100);

      this.topSellingProducts = res.topSellingProducts;
      this.dailyRevenue = res.dailyRevenue;
      this.monthlyRevenue = res.monthlyRevenue;

      this.loadOrders();
      this.totalItems = this.orders.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.drawCharts();
    });
  }

  ngAfterViewInit() {
    // Chart rendering handled in ngOnInit after data loads
  }

  ngOnDestroy() {
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.ordersStatusChart) this.ordersStatusChart.destroy();
  }

  private loadOrders() {
  this.orders = this.dailyRevenue.flatMap((d, i) => {
    return Array.from({ length: d.orderCount }, (_, j) => {
      const productIndex = (i + j) % this.topSellingProducts.length;
      const statuses = ['Completed'];
      const statusIndex = (i + j) % statuses.length;

      return {
        id: 1000 + i + j,
        customer: ['Ali Okasha', 'Ahmed Hassan', 'Sara Ali', 'Mona Khaled'][(i + j) % 4],
        status: statuses[statusIndex],
        product: this.topSellingProducts[productIndex],
        total: d.revenue / d.orderCount,
        date: d.period
      };
    });
  });

  this.totalItems = this.orders.length;
  this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  this.updatePaginatedOrders();
}

  
  updatePaginatedOrders(): void {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedOrders = this.orders.slice(start, end);
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.updatePaginatedOrders();
}

onPageSizeChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  this.itemsPerPage = parseInt(select.value, 10);
  this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  this.currentPage = 1;
  this.updatePaginatedOrders();
}


  statusClass(status: string) {
    return {
      'text-green-600': status === 'Completed',
      'text-red-600': status === 'Cancelled',
      'text-yellow-600': status === 'Processing',
      'text-blue-600': status === 'Pending',
    };
  }

  drawCharts(): void {
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.ordersStatusChart) this.ordersStatusChart.destroy();

    const revenueCtx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (revenueCtx && this.dailyRevenue.length > 0) {
      this.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: this.dailyRevenue.map(d => new Date(d.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
          datasets: [{
            label: 'Daily Revenue (EGP)',
            data: this.dailyRevenue.map(d => d.revenue),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#3B82F6',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `EGP ${(context.raw as number).toLocaleString()}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `EGP ${value}`
              }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    const ordersStatusCtx = document.getElementById('ordersStatusChart') as HTMLCanvasElement;
    if (ordersStatusCtx && this.orderStatusSummary) {
      this.ordersStatusChart = new Chart(ordersStatusCtx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Cancelled'],
          datasets: [{
            data: [
              this.orderStatusSummary.completedOrders,
              this.orderStatusSummary.cancelledOrders
            ],
            backgroundColor: ['#10B981', '#EF4444'],
            borderWidth: 0
          }]
        },
        options: {
          cutout: '70%',
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = Number(context.raw) || 0;
                  const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
  }
}