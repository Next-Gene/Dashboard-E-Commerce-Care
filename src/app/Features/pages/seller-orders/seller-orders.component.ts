import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SellerService } from '../../../core/services/seller-service/seller.service';
import {
  MonthlyRevenue,
  OrderStatusSummary,
  TopSellingProduct,
} from '../../../core/interfaces/SellerDataRes';
import { CommonModule, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, NgClass, PaginationComponent],
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.scss'],
})
export class SellerOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  topSellingProducts: TopSellingProduct[] = [];
  orderStatusSummary: OrderStatusSummary | null = null;
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

  paginatedOrders: any[] = [];

  // For chart rendering
  dataLoaded = false;
  chartsDrawn = false;

  // View references for charts
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ordersStatusChart')
  ordersStatusChartRef!: ElementRef<HTMLCanvasElement>;
  public Math = Math;

  constructor(
    private _SellerService: SellerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // If data is already loaded, draw charts immediately
    if (this.dataLoaded && !this.chartsDrawn) {
      this.drawCharts();
      this.chartsDrawn = true;
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  loadDashboardData(): void {
    this._SellerService.getDashboardData().subscribe({
      next: (res) => {
        this.totalOrders = res.totalOrders;
        this.totalRevenue = res.totalRevenue;
        this.averageOrder = this.totalRevenue / this.totalOrders;
        this.orderStatusSummary = res.orderStatusSummary;

        const total = res.totalOrders;

        if (this.orderStatusSummary) {
          this.completedPercent = Math.round(
            (this.orderStatusSummary.completedOrders / total) * 100
          );
          this.cancelledPercent = Math.round(
            (this.orderStatusSummary.cancelledOrders / total) * 100
          );
        }

        this.topSellingProducts = res.topSellingProducts || [];
        this.monthlyRevenue = res.monthlyRevenue || [];

        this.loadOrders();
        this.dataLoaded = true;

        // If view is ready, draw charts
        if (!this.chartsDrawn) {
          this.drawCharts();
          this.chartsDrawn = true;
        }
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
      },
    });
  }

  private loadOrders() {
    if (!this.monthlyRevenue.length) return;

    this.orders = this.monthlyRevenue.flatMap((d, i) => {
      return Array.from({ length: d.orderCount || 0 }, (_, j) => {
        const productIndex = (i + j) % this.topSellingProducts.length;
        const statuses = ['Completed'];
        const statusIndex = (i + j) % statuses.length;

        return {
          id: 1000 + i + j,
          customer: ['Ali Okasha', 'Ahmed Hassan', 'Sara Ali', 'Mona Khaled'][
            (i + j) % 4
          ],
          status: statuses[statusIndex],
          product: this.topSellingProducts[productIndex] || {
            productId: 0,
            productName: 'Product',
            category: '',
            brand: '',
            quantitySold: 0,
            revenue: 0,
            price: 0,
            photoUrl: '',
          },
          total: d.orderCount ? d.revenue / d.orderCount : 0,
          date: d.period || new Date().toISOString(),
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
    this.destroyCharts();
    this.drawRevenueChart();
    this.drawOrdersStatusChart();
    this.cdr.detectChanges();
  }

  private destroyCharts() {
    if (this.revenueChart) {
      this.revenueChart.destroy();
      this.revenueChart = null;
    }
    if (this.ordersStatusChart) {
      this.ordersStatusChart.destroy();
      this.ordersStatusChart = null;
    }
  }

  private drawRevenueChart() {
    if (!this.revenueChartRef?.nativeElement || !this.monthlyRevenue.length)
      return;

    // Format dates for better display
    const labels = this.monthlyRevenue.map((d) => {
      const date = new Date(d.period);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    });

    this.revenueChart = new Chart(this.revenueChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Monthly Revenue (EGP)',
            data: this.monthlyRevenue.map((d) => d.revenue),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#3B82F6',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) =>
                `EGP ${(context.raw as number).toLocaleString()}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `EGP ${value}`,
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6,
            },
          },
        },
      },
    });
  }

  private drawOrdersStatusChart() {
    if (!this.ordersStatusChartRef?.nativeElement || !this.orderStatusSummary)
      return;

    this.ordersStatusChart = new Chart(
      this.ordersStatusChartRef.nativeElement,
      {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Cancelled'],
          datasets: [
            {
              data: [
                this.orderStatusSummary.completedOrders,
                this.orderStatusSummary.cancelledOrders,
              ],
              backgroundColor: ['#10B981', '#EF4444'],
              borderWidth: 0,
            },
          ],
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
                padding: 20,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = Number(context.raw) || 0;
                  const total = (context.dataset.data as number[]).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      }
    );
  }
}
