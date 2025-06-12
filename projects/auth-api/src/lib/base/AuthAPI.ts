import { Observable } from 'rxjs';

export abstract class AuthAPI {
  abstract Login(data: any): Observable<any>;
  abstract Regester(data: any): Observable<any>;
}
