import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../Enums/ApiEndpoint';
import { Review } from '../interfaces/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private _HttpClient: HttpClient) {}

  getReviews(): Observable<Review[]> {
    return this._HttpClient.get<Review[]>(ApiEndpoint.REVIEW);
  }
}
