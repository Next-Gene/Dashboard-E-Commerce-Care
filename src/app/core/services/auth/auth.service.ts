import { Injectable, signal, WritableSignal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { localStorageKeys } from '../../interfaces/localStorageKeys';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  private userEmailSignal: WritableSignal<string | null> = signal(null);
  private authState$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  constructor() {}

  
  get currentToken(): string {
    return localStorage.getItem(localStorageKeys.JWT)!;
  }

  get isTokenAvailabe(): boolean {
    return !!localStorage.getItem(localStorageKeys.JWT);
  }

  get decodeToken() {
    return this.jwtHelper.decodeToken(
      localStorage.getItem(localStorageKeys.JWT)!
    )!;
  }

  getUser() {
    return this.decodeToken;
  }

  setUserEmail(email: string): void {
    this.userEmailSignal.set(email);
  }
  // Method to get the user's email signal
  getUserEmailSignal(): WritableSignal<string | null> {
    return this.userEmailSignal;
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem(localStorageKeys.JWT);
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(localStorageKeys.JWT);
  }

  getAuthState(): Observable<boolean> {
    return this.authState$.asObservable();
  }
}