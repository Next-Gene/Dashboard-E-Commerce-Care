export interface Role {

  role: string; 
}

export interface UserRoleResponse {
  email: string;
  roles: string[]; 
}

export interface ChangeUserRoleRequest {
  email: string;
  NewRole: string;
}
export interface CurrentUser {
  userName: string;
}