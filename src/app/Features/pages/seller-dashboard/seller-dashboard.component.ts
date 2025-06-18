import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';
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
  topSellingProducts:TopSellingProduct [] = [];
  availableRoles: string[] = [];
  loading = true;
  error: string | null = null;
  orderTime = [
    { label: 'Afternoon', percent: 40 },
    { label: 'Evening', percent: 60 },
    { label: 'Morning', percent: 0 },
  ];

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
    const interval = setInterval(() => {
      if (this.dashboardData) {
        clearInterval(interval);
        this.drawCharts();
      }
    }, 100);
  }

  private drawCharts() {
    // دمر الرسوم السابقة قبل رسم الجديد
    this.reviewChart?.destroy();
    this.orderTimeChart?.destroy();
    this.orderLineChart?.destroy();

    this.reviewChart = new Chart(this.reviewChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dashboardData!.monthlyRevenue.map((d) => d.period),
        datasets: [
          {
            label: 'Revenue',
            data: this.dashboardData!.monthlyRevenue.map((d) => d.revenue),
            backgroundColor: '#5bb8ff',
          },
        ],
      },
      options: { maintainAspectRatio: false },
    });

    this.orderTimeChart = new Chart(this.orderTimeCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.orderTime.map((o) => o.label),
        datasets: [
          {
            data: this.orderTime.map((o) => o.percent),
            backgroundColor: ['#0070CD', '#5BB8FF', '#00366A'],
          },
        ],
      },
      options: { maintainAspectRatio: false, cutout: '60%' },
    });

    this.orderLineChart = new Chart(this.orderLineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.dashboardData!.monthlyRevenue.map((d) => d.period),
        datasets: [
          {
            label: 'Orders',
            data: this.dashboardData!.monthlyRevenue.map((d) => d.orderCount),
            borderColor: '#5BB8FF',
            fill: false,
          },
        ],
      },
      options: { maintainAspectRatio: false },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.reviewChart?.destroy();
    this.orderTimeChart?.destroy();
    this.orderLineChart?.destroy();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this._sellerService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.topSellingProducts = data.topSellingProducts;
        this.loading = false;

        setTimeout(() => this.drawCharts(), 0);
      },
      error: () => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      },
    });
  }
}

