import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../../projects/auth-api/src/public-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink ,RouterLinkActive]
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private jwtHelper = new JwtHelperService();
  isSidebarOpen = true;
  isMobileView = false;
  userName: string = '';
  userRole: string = '';
  isAdmin: boolean = false;
  isSeller: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.checkUserRole();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth <= 768;
      this.isSidebarOpen = !this.isMobileView;
    }
  }

  closeSidebarOnMobile() {
    if (this.isMobileView) {
      this.isSidebarOpen = false;
    }
  }

  private getEmailFromToken(): string {
    if (isPlatformBrowser(this.platformId)) {
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
    }
    return '';
  }

  private checkUserRole(): void {
    this.userName = this.getEmailFromToken();
    if (this.userName) {
      this.authService.GetUserRole(this.userName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.userRole = response.roles[0] || '';
            this.isAdmin = response.roles.includes('Admin');
            this.isSeller = response.roles.includes('Seller');
          },
          error: (error) => {
            console.error('Error fetching user role:', error);
            this.router.navigate(['/login']);
          }
        });
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.Logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
          }
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Logout error:', error);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
