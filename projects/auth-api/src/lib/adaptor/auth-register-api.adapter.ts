import { Injectable } from '@angular/core';
import { Adapter } from '../interface/adapter';
import { RegisterAPIRes, RegisterRes } from '../interface/registerRes';

@Injectable({
  providedIn: 'root'
})
export class AuthRegisterAPIAdapter implements Adapter {

  constructor() { }
  adapt(data:RegisterAPIRes):RegisterRes{
     return {
      message:data.message,
     }
  }
}
