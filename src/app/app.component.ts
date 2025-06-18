import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnInit
} from '@angular/core';
import {
  CommonModule,
  isPlatformBrowser,
  ViewportScroller
} from '@angular/common';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterOutlet,
  Event as RouterEvent
} from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MobileNavComponent } from './core/Layout/mobile-nav/mobile-nav.component';
import { SidebarComponent } from './core/Layout/sidebar/sidebar.component';
import { UserDataServiceService } from './core/services/user-data-service.service';
import { filter } from 'rxjs/operators';
import { LoadingComponent } from './shared/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MobileNavComponent,
    SidebarComponent,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthPage = false;
  isMobileView = false;
  isLoading: boolean = false;
  initialized = false;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private viewportScroller: ViewportScroller,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    // Handle router events for loading state
    this.router.events.subscribe((event: RouterEvent) => {
      this.handleRouterEvent(event);
    });

    if (this.isBrowser) {
      this.breakpointObserver
        .observe([Breakpoints.Handset])
        .subscribe(result => {
          this.isMobileView = result.matches;
        });
    }
  }

  private handleRouterEvent(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.isLoading = true;
    }
    
    if (event instanceof NavigationEnd) {
      this.checkAuthPage(event.urlAfterRedirects);
      if (this.isBrowser) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
      this.initialized = true;
      this.isLoading = false;
    }
    
    if (event instanceof NavigationCancel || event instanceof NavigationError) {
      this.isLoading = false;
    }
    
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.isMobileView = window.innerWidth <= 768;
    }
  }

  private checkAuthPage(url: string) {
    const authPages = [
      '/login',
      '/register',
      '/newPassword',
      '/verifyCode',
      '/resetPassword'
    ];
    const cleanUrl = url.split('?')[0];
    this.isAuthPage = authPages.includes(cleanUrl);
  }
}