import { Observable } from 'rxjs';
import { Product } from '../interface/product';
export abstract class ProductsAPI {
  abstract getAllProducts(): Observable<Product[]>;
}
