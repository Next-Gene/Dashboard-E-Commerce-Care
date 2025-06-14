import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../../core/service/admin-service/admin.service';
import { DashboardDataRes, OrderStatusSummary, TopSellingProduct } from '../../../../core/interfaces/DashboardDataRes';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dashboardData: DashboardDataRes | null = null;
  orderStatusSummary: OrderStatusSummary | null = null;
  topSellingProducts: TopSellingProduct[] = [];
  availableRoles: string[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.loading = false;
          this.loadTopSellingProducts();
          this.loadOrderStatusSummary();
          this.loadAvailableRoles();
        },
        error: (error) => {
          this.error = 'Failed to load dashboard data';
          this.loading = false;
          console.error('Dashboard data error:', error);
        }
      });
  }

  private loadTopSellingProducts(): void {
    this.adminService.getTopSellingProducts()
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

  private loadOrderStatusSummary(): void {
    this.adminService.getOrderStatusSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary) => {
          this.orderStatusSummary = summary;
        },
        error: (error) => {
          console.error('Order status summary error:', error);
        }
      });
  }

  private loadAvailableRoles(): void {
    this.adminService.getAvailableRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles) => {
          this.availableRoles = roles;
        },
        error: (error) => {
          console.error('Available roles error:', error);
        }
      });
  }

  changeUserRole(email: string, newRole: string): void {
    this.adminService.changeUserRole({ email, newRole })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Refresh dashboard data after role change
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Change role error:', error);
        }
      });
  }
} 