import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APICategoriesResponse, Category } from '../interfaces/category';
import { map, Observable } from 'rxjs';
import { ApiEndpoint } from '../Enums/ApiEndpoint ';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

 constructor(private _httpClient: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this._httpClient.get<APICategoriesResponse>(ApiEndpoint.CATEGORIES);
      
  }

  addCategory(data: { name: string; description: string }): Observable<Category> {
    return this._httpClient.post<Category>(ApiEndpoint.CATEGORIES, data);
  }

  updateCategory(id: string, data: { name: string; description: string }): Observable<Category> {
    return this._httpClient.put<Category>(`${ApiEndpoint.CATEGORIES}/${id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this._httpClient.delete(`${ApiEndpoint.CATEGORIES}/${id}`);
  }

  uploadPhotoById(id: string, formData: FormData): Observable<any> {
    return this._httpClient.post(`${ApiEndpoint.CATEGORIES}/${id}/photo`, formData);
  }
}
