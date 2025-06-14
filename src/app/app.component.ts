import { Component, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MobileNavComponent } from './core/Layout/mobile-nav/mobile-nav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidebarComponent } from './core/Layout/sidebar/sidebar.component';
import { ViewportScroller } from '@angular/common';
import { UserDataServiceService } from './core/service/user-data-service.service';
import { filter } from 'rxjs/operators';

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
  isAuthPage = false;
  isMobileView = false;
  isBrowser: boolean;
  initialized = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private userDataService: UserDataServiceService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.checkScreenSize();

    // ✅ تحقق فقط بعد NavigationEnd
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkAuthPage(event.urlAfterRedirects); // ✅ استخدم urlAfterRedirects
      if (this.isBrowser) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
      this.initialized = true;
    });

    if (this.isBrowser) {
      this.breakpointObserver.observe([Breakpoints.Handset])
        .subscribe((result) => {
          this.isMobileView = result.matches;
        });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (this.isBrowser) {
      this.isMobileView = window.innerWidth <= 768;
    }
  }

  private checkAuthPage(url: string) {
    const authPages = ['/login', '/register', '/newPassword', '/verifyCode', '/resetPassword'];
    const currentUrl = url.split('?')[0];
    this.isAuthPage = authPages.includes(currentUrl);
  }
}
