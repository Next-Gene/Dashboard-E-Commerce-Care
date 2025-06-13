import { inject } from '@angular/core';
import { Router, type CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
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

  // Decode token to get email
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  const userEmail = tokenPayload.email;

  // Get required roles from route data
  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No role requirements specified
  }

  // Check if user has required role  
  return authService.GetUserRole().pipe(
    map( (roleResponse: userRoleRes) => {
      const userRole = roleResponse.roles;
      
      // Admin has access to everything
      if (userRole.includes('Admin')) {
        return true;
      }
      // Check if user's role is in the required roles
      if (userRole.some(role => requiredRoles.includes(role))) {
        return true;
      }

      // User doesn't have required role
      router.navigate(['/unauthorized']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
}; 