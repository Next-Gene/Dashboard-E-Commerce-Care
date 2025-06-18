import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangeUserRoleRequest, UserRoleResponse } from '../interfaces/user-role';
import { ApiEndpoint } from '../enums/ApiEndpoint ';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor( private _httpClient: HttpClient) { }
  getUserRoles(email: string): Observable<UserRoleResponse> {
    return this._httpClient.get<UserRoleResponse>(
      `${ApiEndpoint.USE_ROLES}/${email}`
    );
  }

  // Get available roles (array of strings)
  getAvailableRoles(): Observable<string[]> {
    return this._httpClient.get<string[]>(ApiEndpoint.AVAILABLE_ROLES);
  }

  // Change user role (email + new role)
  changeUserRole(payload: ChangeUserRoleRequest): Observable<void> {
    return this._httpClient.post<void>(ApiEndpoint.CHANGE_USER_ROLES, payload);
  }
}
