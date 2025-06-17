import { Injectable } from '@angular/core';
import { AuthAPI } from './base/AuthAPI';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthENDPOINT } from './enums/AuthAPI.endpoint';
import { AuthLoginAPIAdapter } from './adaptor/auth-login-api.adapter';
import { loginUser } from './interface/login';
import { LoginRes } from './interface/loginRes';
import { AuthRegisterAPIAdapter } from './adaptor/auth-register-api.adapter';
import { registerUser } from './interface/register';
import { RegisterRes } from './interface/registerRes';
import { ForgetPassUser } from './interface/forgetPass';
import { VerifyCodeUser } from './interface/VerifyCode';
import { ResetPassUser } from './interface/ResetPass';
import { userRoleRes } from './interface/userRoleRes';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService implements AuthAPI {
  private jwtHelper = new JwtHelperService();
  constructor(
    
    private _HttpClient: HttpClient,
    private _AuthLoginAPIAdapter: AuthLoginAPIAdapter,
    private _AuthRegisterAPIAdapter: AuthRegisterAPIAdapter
  ) { }

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

  private isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  Login(data: loginUser): Observable<LoginRes | never[]> {
    return this._HttpClient.post(AuthENDPOINT.LOGIN, data).pipe(
      map((res: any) => this._AuthLoginAPIAdapter.adapt(res)),
    );
  }

  Regester(data: registerUser): Observable<RegisterRes | never[]> {
    return this._HttpClient.post(AuthENDPOINT.REGISER, data).pipe(
      map((res: any) => this._AuthRegisterAPIAdapter.adapt(res)),
    );
  }

  Forgetpass(data: ForgetPassUser): Observable<any> {
    return this._HttpClient.post(AuthENDPOINT.FORGET_PASSWORD, data);
  }

  VerifyCode(data: VerifyCodeUser): Observable<any> {
    return this._HttpClient.post(AuthENDPOINT.VERIFY_RESET_CODE, data);
  }

  resetpass(data: ResetPassUser): Observable<any> {
    return this._HttpClient.post(AuthENDPOINT.RESET_PASSWORD, data);
  }

  Logout(): Observable<any> {
    return this._HttpClient.get(AuthENDPOINT.LOGIN_OUT);
  }

  GetUserRole(userEmail: string): Observable<userRoleRes> {
    const token = localStorage.getItem('token');
    if (!token || this.isTokenExpired(token)) {
      return of({
        roles: [],
        email: '',
        userName: '',
        fullName: ''
      });
    }

    return this._HttpClient.get<userRoleRes>(`${AuthENDPOINT.Get_User_Role}/${userEmail}`);
  }
}
