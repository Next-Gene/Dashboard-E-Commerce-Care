import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APICategoriesResponse, Category } from '../interfaces/category';
import { map, Observable, switchMap, of, tap } from 'rxjs';
import { ApiEndpoint } from '../enums/ApiEndpoint ';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _httpClient: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this._httpClient.get<APICategoriesResponse>(ApiEndpoint.CATEGORIES).pipe(
      tap(response => console.log('Get All Categories Response:', response))
    );
  }

  addCategory(data: { name: string; description: string; slug: string }): Observable<{ id: number }> {
    return this._httpClient.post<{ message: string, data: { id: number } }>(`${ApiEndpoint.CATEGORIES}`, data).pipe(
      map(response => {
        if (!response.data?.id) {
          throw new Error('❌ Failed to extract category ID from response');
        }
        return { id: response.data.id };
      })
    );
  }
  
  

  updateCategory(id: string, data: { name: string; description: string }): Observable<any> {
    return this._httpClient.put(`${ApiEndpoint.CATEGORIES}/${id}`, data, {
      responseType: 'text' as 'json'
    });
  }

  deleteCategory(id: string): Observable<any> {
    return this._httpClient.delete(`${ApiEndpoint.CATEGORIES}/${id}`, {
      responseType: 'text' as 'json'
    });
  }

  uploadPhotoById(id: string, formData: FormData): Observable<any> {
    return this._httpClient.post(`${ApiEndpoint.CATEGORY_PHOTO}/${id}/photo`, formData).pipe(
      tap(response => console.log('Photo Upload Response:', response))
    );
  }
  

  // Get single category by ID
  getCategoryById(id: string): Observable<Category> {
    return this._httpClient.get<Category>(`${ApiEndpoint.CATEGORIES}/${id}`).pipe(
      tap(category => console.log('Get Category By ID Response:', category))
    );
  }

  addCategoryWithPhoto(
    data: { name: string; description: string; slug: string },
    photo: File
  ): Observable<any> {
    return this.addCategory(data).pipe(
      switchMap(res => {
        const id = res.id;
        if (photo && id) {
          const formData = new FormData();
          formData.append('FIle', photo, photo.name); // 👈 هنا التعديل
          return this.uploadPhotoById(id.toString(), formData).pipe(
            switchMap(() => this.getCategoryById(id.toString()))
          );
        } else {
          return of(null);
        }
      })
    );
  }
  
  
}
