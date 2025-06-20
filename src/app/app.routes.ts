import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () =>
      import('./core/Authcomponents/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'resetPassword',
    loadComponent: () =>
      import(
        './core/Authcomponents/reset/reset-password/reset-password.component'
      ).then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'verifyCode',
    loadComponent: () =>
      import(
        './core/Authcomponents/reset/verfiycode/verfiycode.component'
      ).then((m) => m.VerfiycodeComponent),
  },
  {
    path: 'newPassword',
    loadComponent: () =>
      import(
        './core/Authcomponents/reset/new-password/new-password.component'
      ).then((m) => m.NewPasswordComponent),
  },

  // Authenticated “shell” with its own layout component

  // Admin-area
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './Features/pages/admin-dashboard/admin-dashboard.component'
          ).then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./Features/pages/category/category.component').then(
            (m) => m.CategoryComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./Features/pages/admin-orders/admin-orders.component').then(
            (m) => m.AdminOrdersComponent
          ),
      },
      {
        path: 'manage-products',
        loadComponent: () =>
          import(
            './Features/pages/manage-products/manage-products.component'
          ).then((m) => m.ManageProductsComponent),
      },
      {
        path: 'manage-brands',
        loadComponent: () =>
          import('./Features/pages/manage-brands/manage-brands.component').then(
            (m) => m.ManageBrandsComponent
          ),
      },
      {
        path: 'customer-review',
        loadComponent: () =>
          import('./Features/pages/review/review.component').then(
            (m) => m.ReviewComponent
          ),
      },
      {
        path: 'user-role',
        loadComponent: () =>
          import('./Features/pages/user-role/user-role.component').then(
            (m) => m.UserRoleComponent
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./shared/error-page/error-page.component').then(
            (m) => m.ErrorPageComponent
          ),
      },
    ],
  },

  // Seller-area
  {
    path: 'seller',
    canActivate: [roleGuard],
    data: { roles: ['Seller'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './Features/pages/seller-dashboard/seller-dashboard.component'
          ).then((m) => m.SellerDashboardComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./Features/pages/seller-orders/seller-orders.component').then(
            (m) => m.SellerOrdersComponent
          ),
      },
     {
        path: 'manage-products',
        loadComponent: () =>
          import(
            './Features/pages/manage-products/manage-products.component'
          ).then((m) => m.ManageProductsComponent),
      },
      {
        path: 'manage-brands',
        loadComponent: () =>
          import('./Features/pages/manage-brands/manage-brands.component').then(
            (m) => m.ManageBrandsComponent
          ),
      },
      {
        path: 'customer-review',
        loadComponent: () =>
          import('./Features/pages/review/review.component').then(
            (m) => m.ReviewComponent
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./shared/error-page/error-page.component').then(
            (m) => m.ErrorPageComponent
          ),
      },
    ],
  },

  // Unauthorized
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },

  // Catch-all — redirect to login
  {
    path: '**',
    redirectTo: 'login',
  },
];
