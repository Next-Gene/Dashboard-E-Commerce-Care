import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,  
  imports: [ CommonModule],
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent {
  errorCode: number = 404;
  errorMessage: string = 'Page Not Found';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { error?: any };
    
    if (state?.error) {
      this.errorCode = state.error.status || 500;
      this.errorMessage = state.error.message || 'An unexpected error occurred';
    }
  }

  goBack() {
    window.history.back();
  }
}