import { Injectable } from '@angular/core';
import { APIProductsResponse, Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsAdapter {
  constructor() {}

  ProductsAdapter(response: APIProductsResponse): Product[] {
    return response.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      photoUrl: item.photoUrl,
      productPhotos: item.productPhotos || [],
      productBrand: item.productBrand || '',
      
    }));
  }
}