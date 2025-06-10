import { AlertsComponent } from './../../../../shared/alerts/alerts.component';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmailInputComponent } from '../../../../shared/email-input/email-input.component';
import { AuthApiService } from '../../../../../../projects/auth-api/src/public-api';
import { validsignup } from '../../../../shared/utilites/validsignup';

@Component({
  selector: 'app-new-password',
  imports: [ AlertsComponent, EmailInputComponent ,ReactiveFormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {
private ngUnsubscribe = new Subject<void>(); 
private _router=inject(Router)
private _AuthApiService=inject(AuthApiService)
    errormessage : string="";
    resetpass:FormGroup=new FormGroup({
        email:new FormControl(null,validsignup.email),
        password:new FormControl(null,validsignup.Password),
    confirmPassword:new FormControl(null)
  },this.confirmpass)
  confirmpass(g:AbstractControl){
    return g.get('password')?.value==g.get('confirmPassword')?.value ?null : {missmatch:true}
  }
  submit3=()=>{
    if(this.resetpass.valid)
      {
        this._AuthApiService.resetpass(this.resetpass.value )
        .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe({
    next: (res) => {
      this._router.navigate(["login"])
    },
    error: (err: HttpErrorResponse) => {
      this.errormessage = err.error.message;
    }
  });
      }
  
  }
}
