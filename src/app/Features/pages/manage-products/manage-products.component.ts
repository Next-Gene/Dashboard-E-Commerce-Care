
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { addProduct, Product } from '../../../core/interfaces/product';
import { ProductsService } from '../../../core/services/products.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent {
  protected Math = Math;
  protected URL = URL;
  previewUrl: string | null = null;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  isAdmin = false;

  private toastr = inject(ToastrService);
  private searchSubject = new Subject<string>();

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  searchTerm = '';

  selectedProduct: any = null;
  selectedFile: File | null = null;
  isAddMode = true;
  showProductModal = false;

  selectedProductId: string = '';

  categories: any[] = [];
  brands: any[] = [];

  constructor(private _productService: ProductsService, private _CategoryService: CategoryService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.filterProducts();
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.getBrands();
  }

  getProducts() {
    this._productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.totalItems = res.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.filterProducts();
      },
      error: () => {
        this.toastr.error('Failed to load products', 'Error');
      }
    });
  }

  getCategories() {
    this._CategoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  getBrands() {
    this._productService.getProductBrands().subscribe((res: any) => {
      this.brands = res;
    });
  }

  filterProducts() {
    this.filteredProducts = this.searchTerm
      ? this.products.filter(product =>
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.id.toString().includes(this.searchTerm)
        )
      : this.products;

    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  get pages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }

  openDeleteModal(id: number) {
    this.selectedProductId = id.toString();
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
    if (!document.querySelector('[modal-backdrop]')) {
      const backdrop = document.createElement('div');
      backdrop.setAttribute('modal-backdrop', '');
      backdrop.className = 'bg-gray-900 bg-opacity-50 fixed inset-0 z-40';
      document.body.appendChild(backdrop);
    }
    document.body.classList.add('overflow-hidden');
    document.documentElement.classList.add('overflow-hidden');
  }

  closeModal() {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
    const backdrop = document.querySelector('[modal-backdrop]');
    if (backdrop) backdrop.remove();
    document.body.classList.remove('overflow-hidden');
    document.documentElement.classList.remove('overflow-hidden');
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }

  confirmDelete() {
    this.deleteProduct(this.selectedProductId);
    this.closeModal();
  }

  deleteProduct(id: string) {
    this._productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== +id);
        this.filterProducts();
        this.toastr.success('Product deleted successfully');
      },
      error: () => {
        this.toastr.error('Failed to delete product');
      }
    });
  }

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(select.value, 10);
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.filterProducts();
  }

  openProductModal(product?: Product) {
    this.isAddMode = !product;
    if (product) {
      this.selectedProductId = product.id.toString();  // ✅ أضف السطر ده هنا
      this.selectedProduct = {
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: this.categories.find(c => c.name === product.category)?.id || 0,
        productBrandId: this.brands.find(b => b.name === product.productBrand)?.id || 0,
        photoUrl: product.photoUrl ?? '',
      };
        
      
    } else {
      this.selectedProduct = {
        name: '',
        price: 0,
        description: '',
        categoryId: this.categories[0]?.id || 0,
        productBrandId: this.brands[0]?.id || 0
      };
      this.selectedProductId = '';
    }

    this.selectedFile = null;
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
  
      // 👉 عرض الصورة في الفورم قبل الرفع
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  async submitProduct() {
    if (!this.selectedProduct) return;
  
    const payload: addProduct = {
      name: this.selectedProduct.name,
      price: this.selectedProduct.price,
      description: this.selectedProduct.description,
      categoryId: Number(this.selectedProduct.categoryId),
      productBrandId: Number(this.selectedProduct.productBrandId),
      photoUrl: this.selectedProduct.photoUrl ?? '',
      productPhotos: this.selectedProduct.productPhotos ?? []
    };
  
    try {
      if (this.isAddMode) {
        // 🟢 إضافة منتج جديد
        const response: any = await this._productService.addProduct(payload).toPromise();
        const productId = response?.data?.id;
        if (productId && this.selectedFile) {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          await this._productService.uploadProductPhoto(productId.toString(), formData).toPromise();
        }
        this.toastr.success('Product added successfully');
      } else {
        // 🟡 تعديل منتج موجود
        const updatePayload = {
          id: Number(this.selectedProductId),
          name: this.selectedProduct.name,
          description: this.selectedProduct.description,
          price: this.selectedProduct.price,
          photoUrl: this.selectedProduct.photoUrl ?? '',
          productPhotos: this.selectedProduct.productPhotos ?? []
        };
  
        await this._productService.updateProduct(this.selectedProductId, updatePayload).toPromise();
  
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          await this._productService.uploadProductPhoto(this.selectedProductId, formData).toPromise();
        }
  
        this.toastr.success('Product updated successfully');
      }
  
      this.closeProductModal();
      this.getProducts();
    } catch (error) {
      console.error(error);
      this.toastr.error('Failed to save product');
    }
  }
  
}
