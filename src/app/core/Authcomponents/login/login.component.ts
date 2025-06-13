import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../../../../projects/auth-api/src/public-api';
import { AlertsComponent } from "../../../shared/alerts/alerts.component";
import { validsignup } from '../../../shared/utilites/validsignup';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, AlertsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private ngUnsubscribe = new Subject<void>(); 
  step: number = 1;
  private _router = inject(Router);
  private _AuthApiService = inject(AuthApiService);
  errormessage: string = "";
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  login: FormGroup = new FormGroup({
    email: new FormControl(null, validsignup.email),
    password: new FormControl(null, validsignup.Password),
  });

  Login = () => {
    if (this.login.invalid) {
      this.step = 2;
      return;
    }

    this._AuthApiService.Login(this.login.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem("token", res.token);
          }
          this._router.navigate(['/layout']);
        },
        error: (err: HttpErrorResponse) => {
          this.errormessage = err.error.message;
        }
      });
  }
  
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete(); 
  }
}