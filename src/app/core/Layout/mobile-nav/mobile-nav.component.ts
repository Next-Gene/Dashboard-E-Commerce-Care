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
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThemeService } from '../../services/theme.service';
import { AuthApiService } from '../../../../../projects/auth-api/src/public-api';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class MobileNavComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private jwtHelper = new JwtHelperService();
  private _themeService = inject(ThemeService);

  isDarkMode = false;
  isMobileView = false;
  isSettingsDropdownOpen = false;
  userName: string = '';
  userRole: string = '';
  isAdmin = false;
  isSeller = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: AuthApiService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.subscribeToTheme();
    this.loadUserRole();
  }

  private subscribeToTheme() {
    this._themeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dark) => {
        this.isDarkMode = dark;
      });
  }

  toggleTheme(): void {
    this._themeService.toggleDarkMode();
  }

  toggleSettingsDropdown(): void {
    this.isSettingsDropdownOpen = !this.isSettingsDropdownOpen;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth <= 768;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/home']).then(() => window.location.reload());
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
        }
      }
    }
    return '';
  }

  private loadUserRole(): void {
    this.userName = this.getEmailFromToken();
    if (this.userName) {
      this.authService
        .GetUserRole(this.userName)
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
