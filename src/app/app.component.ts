import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MobileNavComponent } from './core/Layout/mobile-nav/mobile-nav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
export class AppComponent implements OnInit {
  isMobileView = false;
  isAuthPage = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.checkAuthPage();
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkAuthPage();
        if (isPlatformBrowser(this.platformId)) {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.breakpointObserver.observe([Breakpoints.Handset])
        .subscribe((result) => {
          this.isMobileView = result.matches;
        });
    }
  }

  private checkAuthPage() {
    const authPages = ['/login', '/register', '/newPassword', '/verifyCode', '/resetPassword'];
    this.isAuthPage = authPages.includes(this.router.url);
  }
}
