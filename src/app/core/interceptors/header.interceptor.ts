import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service/auth-service.service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = localStorage.getItem('token');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
