import { environment } from "../../../../environments/environment.prod";

export class ApiEndpoint {
  static PRODUCTS = `${environment.baseUrl}/api/v1/products`;

}
