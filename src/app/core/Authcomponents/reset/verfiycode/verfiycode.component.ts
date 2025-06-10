import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../../../projects/auth-api/src/public-api';
import { AlertsComponent } from '../../../../shared/alerts/alerts.component';
import { validsignup } from '../../../../shared/utilites/validsignup';

@Component({
  selector: 'app-verfiycode',
  imports: [  ReactiveFormsModule, AlertsComponent],
  templateUrl: './verfiycode.component.html',
  styleUrl: './verfiycode.component.scss'
})
export class VerfiycodeComponent {
  private ngUnsubscribe = new Subject<void>();
  private _router = inject(Router);
  private _AuthApiService = inject(AuthApiService);

  errormessage: string = '';
  verifycode !: FormGroup;

  ngOnInit(): void {
    this.verifycode = new FormGroup({
              email:new FormControl(null,validsignup.email),

      digit1: new FormControl(null, [Validators.required]),
      digit2: new FormControl(null, [Validators.required]),
      digit3: new FormControl(null, [Validators.required]),
      digit4: new FormControl(null, [Validators.required]),
      digit5: new FormControl(null, [Validators.required]),
      digit6: new FormControl(null, [Validators.required]),
    });
  }

  onInput(event: Event, nextControlName?: string, prevControlName?: string): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value.length === 0 && prevControlName) {
      this.focusControl(prevControlName);
    } else if (inputElement.value.length === 1 && nextControlName) {
      this.focusControl(nextControlName);
    }
  }


  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    const digits = pasteData.replace(/\D/g, ''); // Only take numbers from the pasted data

    // Split the pasted digits into the form controls
    Object.keys(this.verifycode.controls).forEach((controlName, index) => {
      if (digits[index]) {
        this.verifycode.get(controlName)?.setValue(digits[index]);
      }
    });

    // Focus the last input with a value
    const lastFilledControl = Object.keys(this.verifycode.controls).find((controlName, index) => {
      return digits[index] && !digits[index + 1];
    });
    if (lastFilledControl) {
      this.focusControl(lastFilledControl);
    }
  }

  private focusControl(controlName: string): void {
    const control = this.verifycode.get(controlName);
    if (control) {
      const inputElement = document.querySelector(`[formControlName="${controlName}"]`) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }

  submit2(): void {
  if (this.verifycode.valid) {
    const email = this.verifycode.get('email')?.value || '';
    const code = [
      this.verifycode.get('digit1')?.value,
      this.verifycode.get('digit2')?.value,
      this.verifycode.get('digit3')?.value,
      this.verifycode.get('digit4')?.value,
      this.verifycode.get('digit5')?.value,
      this.verifycode.get('digit6')?.value,
    ].join('');
      this._AuthApiService.VerifyCode({ code, email })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this._router.navigate(['newPassword']);
          },
          error: (err: HttpErrorResponse) => {
            this.errormessage = err.error.message;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }}
