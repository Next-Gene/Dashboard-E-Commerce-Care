import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {



        path: 'resetPassword',
        loadComponent: () =>
            import('./core/Authcomponents/reset/reset-password/reset-password.component').then(
                (c) => c.ResetPasswordComponent
            ),
    },
        {
        path: 'login',
        loadComponent: () =>
            import('./core/Authcomponents/login/login.component').then(
                (c) => c.LoginComponent
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
        loadComponent: () =>
            import('./Features/pages/home/home.component').then(
                (c) => c.HomeComponent
            ),
    },

    {
        path: 'category',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./Features/pages/category/category.component').then(
                (c) => c.CategoryComponent
            ),
    },
    
];
