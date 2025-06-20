import { CurrentUser } from './../../interfaces/user-role';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { localStorageKeys } from '../../interfaces/localStorageKeys';
import { ApiEndpoint } from '../../Enums/ApiEndpoint';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  private userEmailSignal: WritableSignal<string | null> = signal(null);
  private authState$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  constructor(private _httpClient: HttpClient) {}

  
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
    getCurrentUser(): Observable<CurrentUser> {
  return this._httpClient.get<CurrentUser>(ApiEndpoint.CURRENT_USER);
}
}