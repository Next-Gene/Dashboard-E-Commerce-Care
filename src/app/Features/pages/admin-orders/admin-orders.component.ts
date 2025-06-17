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

  // Overview metrics
  averageOrder = 0;
  totalRevenue = 0;
  avgProcessingTime = 0;
  avgItemsPerOrder = 0;
  pendingOrdersPercent = 0;
  rejectRate = 0;
  orders: {
    id: number;
    customer: string;
    type: string;
    status: string;
    product: TopSellingProduct;
    total: number;
    date: string;
  }[] = [];
  // Order status percentages
  paidPercent = 0;
  cancelledPercent = 0;
  refundedPercent = 0;
  statusClass(status: string) {
    return {
      'text-green-600': status === 'Paid',
      'text-red-600': status === 'Cancelled',
      'text-yellow-600': status === 'Refunded',
    };
  }
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboardData().subscribe((res) => {
      this.averageOrder = res.averageOrder;
      this.totalRevenue = res.totalRevenue;
      this.avgProcessingTime = res.avgProcessingTime;
      this.avgItemsPerOrder = res.avgItemsPerOrder;
      this.pendingOrdersPercent = res.pendingOrdersPercent;
      this.rejectRate = res.rejectRate;
      this.orderStatusSummary = res.orderStatusSummary;
  
      // Calculate status percentages
      const total = res.orderStatusSummary.completedOrders + res.orderStatusSummary.cancelledOrders + res.orderStatusSummary.refundedOrders;
      this.paidPercent = Math.round((res.orderStatusSummary.completedOrders / total) * 100);
      this.cancelledPercent = Math.round((res.orderStatusSummary.cancelledOrders / total) * 100);
      this.refundedPercent = Math.round((res.orderStatusSummary.refundedOrders / total) * 100);
    });
    this.adminService
      .getTopSellingProducts()
      .subscribe((data) => (this.topSellingProducts = data));
    this.adminService
      .getDailyRevenue()
      .subscribe((data) => (this.dailyRevenue = data));
    this.adminService
      .getMonthlyRevenue()
      .subscribe((data) => (this.monthlyRevenue = data));
    this.loadOrders();
  
  }
  drawCharts() {
    // Donut chart for shipping/pickups
    if (this.orderStatusSummary) {
      new Chart('receiptDonutChart', {
        type: 'doughnut',
        data: {
          labels: ['Shipping', 'Pickups'],
          datasets: [{
            data: [
              this.orderStatusSummary.shipping,
              this.orderStatusSummary.pickups
            ],
            backgroundColor: ['#3B82F6', '#10B981'],
            borderWidth: 0
          }]
        },
        options: {
          cutout: '80%',
          plugins: { legend: { display: false } }
        }
      });
    }
    
    new Chart('dailyLineChart', {
      type: 'line',
      data: {
        labels: this.dailyRevenue.map((d) => d.period),
        datasets: [{ data: this.dailyRevenue.map((d) => d.revenue) }],
      },
    });
    // Monthly line
    new Chart('monthlyLineChart', {
      type: 'line',
      data: {
        labels: this.monthlyRevenue.map((m) => m.period),
        datasets: [{ data: this.monthlyRevenue.map((m) => m.revenue) }],
      },
    });
  }
  ngAfterViewInit() {
    // Donut
    this.drawCharts();

  }

  private loadOrders() {
    this.adminService.getDashboardData().subscribe((res) => {
      // هنا نفترض أن الـ API يعيد مصفوفة orders حقيقية،
      // وإلا يمكنك تحويل أي بيانات تريدها إلى شكل orders
      this.orders = res.dailyRevenue.map((d, i) => ({
        id: 1000 + i,
        customer: 'Ali Okasha',
        type: i % 2 ? 'Shipping' : 'Pickups',
        status: ['Paid', 'Cancelled', 'Refunded'][i % 3],
        product: res.topSellingProducts[i],
        total: 590,
        date: d.period, // أو أي حقل تاريخ مناسب
      }));
    });
  }
}
