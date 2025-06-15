import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
<<<<<<< HEAD
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';
import { provideToastr } from 'ngx-toastr';
=======
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';
import { headerInterceptor } from './core/interceptors/header.interceptor';
>>>>>>> 4cd51dc79d1954dba0828a9a57363b21f04b88b1

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideToastr(), 
        provideAnimations(),

    provideClientHydration(withEventReplay()),
<<<<<<< HEAD
    
    provideHttpClient(withFetch()),
=======
    provideHttpClient(
      withFetch(),
      withInterceptors([headerInterceptor])
    ),
>>>>>>> 4cd51dc79d1954dba0828a9a57363b21f04b88b1
    BreakpointObserver
  ]
};
