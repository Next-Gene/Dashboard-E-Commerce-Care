import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/Authcomponents/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'resetPassword',
    loadComponent: () =>
      import('./core/Authcomponents/reset/reset-password/reset-password.component').then(
        (c) => c.ResetPasswordComponent
      ),
  },
  {
    path: 'verifyCode',
    loadComponent: () =>
      import('./core/Authcomponents/reset/verfiycode/verfiycode.component').then(
        (c) => c.VerfiycodeComponent
      ),
  },
  {
    path: 'newPassword',
    loadComponent: () =>
      import('./core/Authcomponents/reset/new-password/new-password.component').then(
        (c) => c.NewPasswordComponent
      ),
  },
  {
    path: 'layout',
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./Features/pages/home/home.component').then(
            (c) => c.HomeComponent
          ),
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./Features/pages/admin/admin-dashboard/admin-dashboard.component').then(
                (c) => c.AdminDashboardComponent
              ),
          },
          {
            path: 'category',
            loadComponent: () =>
              import('./Features/pages/category/category.component').then(
                (c) => c.CategoryComponent
              ),
          }
        ]
      },
      {
        path: 'seller',
        canActivate: [roleGuard],
        data: { roles: ['Seller'] },
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./Features/pages/seller/seller-dashboard/seller-dashboard.component').then(
                (c) => c.SellerDashboardComponent
              ),
          }
        ]
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized/unauthorized.component').then(
        (c) => c.UnauthorizedComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
