import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service/admin.service';
import { Chart } from 'chart.js/auto';
import {
  OrderStatusSummary,
  TopSellingProduct,
  DailyRevenue,
  MonthlyRevenue,
} from '../../../core/interfaces/DashboardDataRes';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, NgClass],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit, AfterViewInit {
  topSellingProducts: TopSellingProduct[] = [];
  orderStatusSummary: OrderStatusSummary | null = null;
  dailyRevenue: DailyRevenue[] = [];
  monthlyRevenue: MonthlyRevenue[] = [];

  averageOrder = 0;
  totalRevenue = 0;
  totalOrders = 0;
  completedPercent = 0;
  cancelledPercent = 0;
  pendingPercent = 0;
  processingPercent = 0;
  
  orders: {
    id: number;
    customer: string;
    status: string;
    product: TopSellingProduct;
    total: number;
    date: string;
  }[] = [];

  revenueChart: Chart | null = null;
  ordersStatusChart: Chart | null = null;

  statusClass(status: string) {
    return {
      'text-green-600': status === 'Completed',
      'text-red-600': status === 'Cancelled',
      'text-yellow-600': status === 'Processing',
      'text-blue-600': status === 'Pending',
    };
  }
  
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
      this.drawCharts(); // Draw charts after data is loaded
    });
  }
  
  drawCharts() {
    // Destroy existing charts if they exist
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.ordersStatusChart) {
      this.ordersStatusChart.destroy();
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (revenueCtx && this.dailyRevenue.length > 0) {
      this.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: this.dailyRevenue.map(d => new Date(d.period).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})),
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
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `EGP ${(context.raw as number).toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return `EGP ${value}`;
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
    
    // Orders Status Chart
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
            backgroundColor: [
              '#10B981',
              '#EF4444'
            ],
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
                label: function(context) {
                  const label = context.label || '';
                  const value = Number(context.raw) || 0;
                  const total = (context.dataset.data as number[]).reduce((a, b) => Number(a) + Number(b), 0);
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
  
  ngAfterViewInit() {
    // Charts are now drawn after data is loaded in ngOnInit
  }

  private loadOrders() {
    this.orders = this.dailyRevenue.flatMap((d, i) => {
      return Array.from({length: d.orderCount}, (_, j) => {
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
  }

  ngOnDestroy() {
    // Clean up charts when component is destroyed
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.ordersStatusChart) {
      this.ordersStatusChart.destroy();
    }
  }
}