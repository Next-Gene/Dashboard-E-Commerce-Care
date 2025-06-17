import { environment } from "../../../../Environments/environment ";

export class ApiEndpoint {
  // Admin Dashboard Endpoints
  static ADMIN_DASHBOARD = `${environment.baseUrl}/api/v1/reports/admin/dashboard`;
  static ADMIN_top_selling_products = `${environment.baseUrl}/api/v1/reports/admin/top-selling-products`;
  static ADMIN_order_status_summary = `${environment.baseUrl}/api/v1/reports/admin/order-status-summary`;
  static ADMIN_CHANGE_ROLE = `${environment.baseUrl}/api/v1/Auth/change-user-role`;
  static ADMIN_AVAILABLE_ROLES = `${environment.baseUrl}/api/v1/Auth/available-roles`;

  // Seller Dashboard Endpoints
  static SELLER_DASHBOARD = `${environment.baseUrl}/api/v1/reports/seller/dashboard`;
  static SELLER__top_selling_products = `${environment.baseUrl}/api/v1/reports/seller/top-selling-products`;
  static SELLER_DAILY_REVENUE=`${environment.baseUrl}/api/v1/reports/daily-revenue` ;

  // Product Endpoints
  static PRODUCTS = `${environment.baseUrl}/api/v1/products`;
  static PRODUCT_SET_MAIN_PHOTO = `${environment.baseUrl}/api/v1/products/set-main-photo`;
  static PRODUCT_DELETE_PHOTO = `${environment.baseUrl}/api/v1/products/delete-photo`;

  // Product Brand Endpoints
  static PRODUCT_BRANDS = `${environment.baseUrl}/api/v1/product-brands`;
  static PRODUCT_BRAND_UPDATE = `${environment.baseUrl}/api/v1/product-brands`;
  static PRODUCT_BRAND_DELETE = `${environment.baseUrl}/api/v1/product-brands`;

  // Category Endpoints
  
  static CATEGORIES = `${environment.baseUrl}/api/v1/categories`;
  static CATEGORY_PHOTO = `${environment.baseUrl}/api/v1/categories`;

  static REVIEW = 'assets/review.json'; 

}