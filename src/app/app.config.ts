import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';
import { headerInterceptor } from './core/interceptors/header.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideToastr(), 
        provideAnimations(),

    provideClientHydration(withEventReplay()),
    
    provideHttpClient(withFetch()),
    provideHttpClient(
      withFetch(),
      withInterceptors([headerInterceptor])
    ),
    BreakpointObserver
  ]
};
