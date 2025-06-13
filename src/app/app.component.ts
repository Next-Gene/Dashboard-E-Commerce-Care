import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { MobileNavComponent } from './core/Layout/mobile-nav/mobile-nav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { SidebarComponent } from './core/Layout/sidebar/sidebar.component';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MobileNavComponent,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BreakpointObserver]
})
export class AppComponent implements OnInit, OnDestroy {
  isMobileView = false;
  private subscription: Subscription | null = null;
  isAuthPage: boolean = false;
  isLoading: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;
      }

      if (event instanceof NavigationEnd) {
        const authPages = [
          '/login',
          '/register',
          '/newPassword',
          '/verifyCode',
          '/resetPassword',
        ];
        this.isAuthPage = authPages.includes(event.url);
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.subscription = this.breakpointObserver
        .observe([Breakpoints.Handset])
        .subscribe(result => {
          this.isMobileView = result.matches;
        });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}



