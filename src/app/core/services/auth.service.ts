import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../../projects/auth-api/src/public-api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private jwtHelper = new JwtHelperService();
  private authApiService = inject(AuthApiService);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor() {
    // Check token expiration on startup
    this.checkTokenExpiration();
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  removeToken(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken?.email || null;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }
    return null;
  }

  login(email: string, password: string): Observable<any> {
    return this.authApiService.Login({ email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return false;
    }
  }

  private checkTokenExpiration(): void {
    if (!this.hasValidToken()) {
      this.removeToken();
      this.router.navigate(['/login']);
    }
  }
} 