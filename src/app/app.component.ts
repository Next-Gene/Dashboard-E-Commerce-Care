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
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MobileNavComponent } from './core/Layout/mobile-nav/mobile-nav.component';
import { SidebarComponent } from './core/Layout/sidebar/sidebar.component';
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
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthPage = false;
  isMobileView = false;
  initialized = false;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private userDataService: UserDataServiceService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    // 1) Watch for initial navigation end to set up layout
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((evt: NavigationEnd) => {
        this.checkAuthPage(evt.urlAfterRedirects);
        if (this.isBrowser) {
          // ensure top-of-page on each navigation
          this.viewportScroller.scrollToPosition([0, 0]);
        }
        this.initialized = true;
      });

    // 2) Observe handset breakpoint (Angular CDK)
    if (this.isBrowser) {
      this.breakpointObserver
        .observe([Breakpoints.Handset])
        .subscribe(result => {
          this.isMobileView = result.matches;
        });
    }
  }

  @HostListener('window:resize')
  onResize() {
    // fallback for non-CDK environments
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
