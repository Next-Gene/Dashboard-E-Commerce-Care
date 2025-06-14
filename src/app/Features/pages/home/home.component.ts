import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthApiService } from '../../../../../projects/auth-api/src/public-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AdminService } from '../../../core/service/admin-service/admin.service';
import { SellerService } from '../../../core/service/seller-service/seller.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private jwtHelper = new JwtHelperService();
  isAdmin: boolean = false;
  isSeller: boolean = false;
  userName: string = '';
  loading: boolean = true;
  error: string | null = null;
  
  // Dashboard Data
  dashboardData: any = null;
  topSellingProducts: any[] = [];
  dailyRevenue: any = null;

  constructor(
    private authService: AuthApiService,
    private adminService: AdminService,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const email = this.getEmailFromToken();
    if (email) {
      this.checkUserRole(email);
    } else {
      this.error = 'Unable to retrieve user information';
      this.loading = false;
    }
  }

  private getEmailFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken?.email || '';
      } catch (e) {
        console.error('Error decoding token:', e);
        return '';
      }
    }
    return '';
  }

  private checkUserRole(email: string): void {
    this.authService.GetUserRole(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Extract username from email (remove domain part)
          this.userName = email.split('@')[0];
          this.isAdmin = response.roles.includes('Admin');
          this.isSeller = response.roles.includes('Seller');
          this.loading = false;
          
          // Load appropriate dashboard data
          if (this.isAdmin) {
            this.loadAdminDashboard();
          } else if (this.isSeller) {
            this.loadSellerDashboard();
          }
        },
        error: (error) => {
          console.error('Error fetching user role:', error);
          this.error = 'Failed to load user role information';
          this.loading = false;
        }
      });
  }

  private loadAdminDashboard(): void {
    this.adminService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
        },
        error: (error) => {
          console.error('Error loading admin dashboard:', error);
        }
      });

    this.adminService.getTopSellingProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.topSellingProducts = products;
        },
        error: (error) => {
          console.error('Error loading top products:', error);
        }
      });
  }

  private loadSellerDashboard(): void {
    this.sellerService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
        },
        error: (error) => {
          console.error('Error loading seller dashboard:', error);
        }
      });

    this.sellerService.getDailyRevenue()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dailyRevenue = data;
        },
        error: (error) => {
          console.error('Error loading daily revenue:', error);
        }
      });

    this.sellerService.getTopSellingProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.topSellingProducts = products;
        },
        error: (error) => {
          console.error('Error loading top products:', error);
        }
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
