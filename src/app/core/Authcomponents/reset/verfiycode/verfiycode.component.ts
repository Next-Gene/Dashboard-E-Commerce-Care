import { UserDataServiceService } from './../../../service/user-data-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../../../projects/auth-api/src/public-api';
import { AlertsComponent } from '../../../../shared/alerts/alerts.component';
import { validsignup } from '../../../../shared/utilites/validsignup';

@Component({
  selector: 'app-verfiycode',
  imports: [ReactiveFormsModule, AlertsComponent],
  templateUrl: './verfiycode.component.html',
  styleUrl: './verfiycode.component.scss'
})
export class VerfiycodeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private _router = inject(Router);
  private _AuthApiService = inject(AuthApiService);
  private _resetFlowService = inject(UserDataServiceService);

  errormessage: string = '';
  verifycode!: FormGroup;

  ngOnInit(): void {
    this.verifycode = new FormGroup({
      email: new FormControl(this._resetFlowService.getEmail() ?? "", validsignup.email),
      code: new FormControl(null, validsignup.code)
    });
  }

  submit2(): void {
    if (this.verifycode.invalid) {
      this.errormessage = 'Please fill in all required fields correctly.';
      return;
    }

    const email = this.verifycode.get('email')?.value || '';
    const code = this.verifycode.get('code')?.value || '';

    this._AuthApiService.VerifyCode({ code, email })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this._router.navigate(['newPassword']);
        },
        error: (err: HttpErrorResponse) => {
          this.errormessage = err.error?.message || 'Verification failed. Please try again.';
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}