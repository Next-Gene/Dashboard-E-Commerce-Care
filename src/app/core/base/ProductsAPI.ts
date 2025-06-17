import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
export abstract class ProductsAPI {
  abstract getAllProducts(): Observable<Product[]>;
}
