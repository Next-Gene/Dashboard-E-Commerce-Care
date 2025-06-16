import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductsAPI } from '../base/ProductsAPI';
import { map, Observable } from 'rxjs';
import { ProductsAdapter } from '../adapter/products.adapter';
import { APIProductsResponse, Product } from '../interface/product';
import { ApiEndpoint } from '../enums/api.endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements ProductsAPI {
  constructor(
    private _httpClient: HttpClient,
    private _productsAdapter: ProductsAdapter
  ) {}

  getAllProducts(): Observable<Product[]> {
    return this._httpClient
      .get<APIProductsResponse>(ApiEndpoint.PRODUCTS)
      .pipe(map((res) => this._productsAdapter.ProductsAdapter(res)));
  }
  getProductById(id: string): Observable<Product> {
    return this._httpClient.get<APIProductsResponse>(ApiEndpoint.PRODUCTS).pipe(
      map((res: APIProductsResponse) => {
        const product = res.find((p) => String(p.id) === String(id));
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }
        return product;
      })
    );
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
deleteProduct(id: string): Observable<string> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this._httpClient.delete<string>(`${ApiEndpoint.PRODUCTS}/${id}`, {
    headers,
    responseType: 'text' as 'json'
  });
}
}
