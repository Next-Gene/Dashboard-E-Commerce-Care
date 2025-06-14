import { inject } from '@angular/core';
import { Router, type CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AuthApiService } from '../../../../projects/auth-api/src/public-api';
import { map, catchError, of } from 'rxjs';
import { userRoleRes } from '../../../../projects/auth-api/src/lib/interface/userRoleRes';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthApiService);

  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  const userEmail = tokenPayload.email;

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  return authService.GetUserRole(userEmail).pipe(
    map((roleResponse: userRoleRes) => {
      const userRoles = roleResponse.roles;

      if (userRoles.includes('Admin')) return true;

      if (userRoles.some(role => requiredRoles.includes(role))) return true;

      router.navigate(['/unauthorized']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};
