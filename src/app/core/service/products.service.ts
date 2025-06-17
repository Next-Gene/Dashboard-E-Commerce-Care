import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductsAPI } from '../base/ProductsAPI';
import { map, Observable } from 'rxjs';
import { ProductsAdapter } from '../adapter/products.adapter';
import { addProduct, APIProductsResponse, Product, updateProduct } from '../interfaces/product';
import { ApiEndpoint } from '../enums/ApiEndpoint ';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements ProductsAPI {
  constructor(
    private _httpClient: HttpClient,
    private _productsAdapter: ProductsAdapter
  ) {}

  getAllProducts(): Observable<Product[]> {
    return this._httpClient.get<Product[]>(ApiEndpoint.PRODUCTS);
  }

  getProductById(id: string): Observable<Product> {
    return this._httpClient.get<Product>(`${ApiEndpoint.PRODUCTS}/${id}`);
  }

  getRelatedProducts(
    category: string,
    excludeProductId: string
  ): Observable<Product[]> {
    return this._httpClient.get<APIProductsResponse>(ApiEndpoint.PRODUCTS).pipe(
      map((res: APIProductsResponse) => {
        return res.filter(
          (p) =>
            p.category === category && String(p.id) !== String(excludeProductId)
        );
      })
    );
  }

  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return this._httpClient.get<APIProductsResponse>(ApiEndpoint.PRODUCTS).pipe(
      map((res: APIProductsResponse) => {
        const filteredProducts = res.filter(
          (product) =>
            product.category?.toLowerCase() === categoryName.toLowerCase()
        );
        return this._productsAdapter.ProductsAdapter(filteredProducts);
      })
    );
  }

  addProduct(product: addProduct): Observable<{ message: string; data: { id: number } }> {
    return this._httpClient.post<{ message: string; data: { id: number } }>(ApiEndpoint.PRODUCTS, product);
  }
  
  updateProduct(id: string, product: updateProduct) {
    return this._httpClient.put(`${ApiEndpoint.PRODUCTS}/${id}`, product, {
      responseType: 'text' as 'json'  // 👈 هنا
    });
  }
  
  
  deleteProduct(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${ApiEndpoint.PRODUCTS}/${id}`, {
      responseType: 'text' as 'json'
    });

  }

  uploadProductPhoto(id: string, formData: FormData): Observable<any> {
    return this._httpClient.post(`${ApiEndpoint.PRODUCTS}/${id}/photo`, formData);



  }

  getProductBrands(): Observable<any> {
    return this._httpClient.get<any>(`${ApiEndpoint.PRODUCT_BRANDS}`);
  }


}
