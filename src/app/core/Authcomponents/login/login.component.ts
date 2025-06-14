import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, PLATFORM_ID, Inject, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../../../../projects/auth-api/src/public-api';
import { AlertsComponent } from "../../../shared/alerts/alerts.component";
import { validsignup } from '../../../shared/utilites/validsignup';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, AlertsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  step: number = 1;
  private _router = inject(Router);
  private _AuthApiService = inject(AuthApiService);
  private jwtHelper = new JwtHelperService();
  errormessage: string = "";
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  login: FormGroup = new FormGroup({
    email: new FormControl(null, validsignup.email),
    password: new FormControl(null, validsignup.Password),
  });

  private getEmailFromToken(token: string): string {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.email || '';
    } catch (e) {
      console.error('Error decoding token:', e);
      return '';
    }
  }

  private getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
  }

  private removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }

  private isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  ngOnInit() {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const email = this.getEmailFromToken(token);
      if (email) {
        this.login.patchValue({ email });
      }
      this.checkUserRoleAndRedirect();
    } else if (token) {
      this.removeToken();
    }
  }

  private checkUserRoleAndRedirect() {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const email = this.getEmailFromToken(token);
      if (email) {
        this._AuthApiService.GetUserRole(email)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.roles && response.roles.length > 0) {
                if (response.roles.includes('Admin')) {
                  this._router.navigate(['/admin/dashboard']);
                } else if (response.roles.includes('Seller')) {
                  this._router.navigate(['/seller/dashboard']);
                } else {
                  this._router.navigate(['/home']);
                }
              } else {
                this.removeToken();
                this._router.navigate(['/login']);
              }
            },
            error: (error) => {
              console.error('Error fetching user role:', error);
              this.removeToken();
              this._router.navigate(['/login']);
            }
          });
      } else {
        this.removeToken();
        this._router.navigate(['/login']);
      }
    } else if (token) {
      this.removeToken();
      this._router.navigate(['/login']);
    }
  }

  Login = () => {
    if (this.login.invalid) {
      this.step = 2;
      return;
    }

    this._AuthApiService.Login(this.login.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.setToken(res.token);
          const email = this.getEmailFromToken(res.token);
          if (email) {
            this.login.patchValue({ email });
          }
          this.checkUserRoleAndRedirect();
        },
        error: (err: HttpErrorResponse) => {
          this.errormessage = err.error.message;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
