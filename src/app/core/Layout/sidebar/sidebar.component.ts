import { JwtHelperService } from '@auth0/angular-jwt';
import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../../projects/auth-api/src/public-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth-service/auth-service.service';
import { CurrentUser } from '../../interfaces/user-role';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private jwtHelper = new JwtHelperService();
  isSidebarOpen = true;
  isMobileView = false;
  email: string = '';
  userRole: string = '';
  isAdmin: boolean = false;
  isSeller: boolean = false;
  currentUserName: string = '';
  private _ThemeService = inject(ThemeService);
  isdarkmode = false;

  isSettingsDropdownOpen: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authServicelib: AuthApiService,
    private _authService: AuthService,
    private router: Router
  ) {}
  toggleTheme() {
    this._ThemeService.toggleDarkMode();
  }
  ngOnInit() {
    this.checkScreenSize();
    this.checkUserRole();
    this._ThemeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark) => {
        this.isdarkmode = isDark;
      });
    this._authService.getCurrentUser().subscribe({
      next: (user: CurrentUser) => {
        this.currentUserName = user.userName; // أو حسب اسم الحقل في CurrentUser
      },
      error: (err) => {
        console.error('Failed to load current user', err);
        this.currentUserName = 'Guest';
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  toggleSettingsDropdown() {
    this.isSettingsDropdownOpen = !this.isSettingsDropdownOpen;
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
    this.email = this.getEmailFromToken();
    if (this.email) {
      this.authServicelib
        .GetUserRole(this.email)
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
          },
        });
    }
  }
  getcurrentUser(): string {
    return this.currentUserName;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
