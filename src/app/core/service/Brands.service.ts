import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brandsbody, BrandsResponse } from '../interfaces/Brands';
import { ApiEndpoint } from '../Enums/ApiEndpoint ';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

constructor(private http: HttpClient) { }

getBrands() {
  return this.http.get<BrandsResponse>(ApiEndpoint.PRODUCT_BRANDS);
}

addBrand(brand: Brandsbody) {
  return this.http.post<BrandsResponse>(ApiEndpoint.PRODUCT_BRANDS, brand);
}

updateBrand(id: number, brand: Brandsbody) {
  return this.http.put<BrandsResponse>(ApiEndpoint.PRODUCT_BRANDS + '/' + id, brand , {  responseType: 'text' as 'json'  });
  
}

deleteBrand(id: number) {
  return this.http.delete<BrandsResponse>(ApiEndpoint.PRODUCT_BRANDS + '/' + id, {  responseType: 'text' as 'json'  });
}
}

