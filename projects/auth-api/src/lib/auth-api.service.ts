import { Injectable } from '@angular/core';
import { AuthAPI } from './base/AuthAPI';
import {  map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root',
})
export class AuthApiService implements AuthAPI {
  constructor(
    private _HttpClient: HttpClient,
    private _AuthLoginAPIAdapter: AuthLoginAPIAdapter,
    private _AuthRegisterAPIAdapter: AuthRegisterAPIAdapter
  ) { }
  Login(data: loginUser): Observable<LoginRes | never[]> {
    return this._HttpClient.post(AuthENDPOINT.LOGIN, data).pipe(
      map((res: any) =>  this._AuthLoginAPIAdapter.adapt(res)),
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
  Logout() :Observable<any>{
    return this._HttpClient.get(AuthENDPOINT.LOGIN_OUT );
  }
  
}
