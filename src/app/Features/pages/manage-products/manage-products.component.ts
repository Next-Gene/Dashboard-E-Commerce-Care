import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../../core/service/products.service';
import { Modal } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-products',
  imports: [CommonModule],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent {

  products: any[] = [];
  isAdmin = false;
  private toastr = inject(ToastrService);

  constructor(
    private _productService: ProductsService
  ) { }

  Modal: any; // تعريف مؤقت
  selectedProductId: string = '';

  showConfirmModal(productId: string) {
    const modalEl = document.getElementById('popup-modal');
    if (!modalEl) return;

    const modal = new Modal(modalEl);
    modal.show();

    const confirmBtn = modalEl.querySelector('#confirm-delete') as HTMLButtonElement;
    confirmBtn?.addEventListener('click', () => {
      modal.hide();
      this.deleteProduct(productId);
    });
  }
  ngOnInit(): void {
    this.getproduct();


  }
  openDeleteModal(id: string) {
    this.selectedProductId = id;
   const modal = document.getElementById('popup-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }
   if (!document.querySelector('[modal-backdrop]')) {
    const backdrop = document.createElement('div');
    backdrop.setAttribute('modal-backdrop', '');
    backdrop.className = 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40';
    document.body.appendChild(backdrop);
  }

  // منع التمرير
  document.body.classList.add('overflow-hidden');
  document.documentElement.classList.add('overflow-hidden');

  }
closeModal() {
  const modal = document.getElementById('popup-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  // حذف الخلفية
  const backdrop = document.querySelector('[modal-backdrop]');
  if (backdrop) {
    backdrop.remove();
  }

  // السماح بالتمرير مرة تانية
  document.body.classList.remove('overflow-hidden');
  document.documentElement.classList.remove('overflow-hidden');
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
}

  getproduct() {
    this._productService.getAllProducts().subscribe((res) => {
      this.products = res;
    });
  }

confirmDelete() {
  this.deleteProduct(this.selectedProductId);
  this.closeModal();
}
  deleteProduct(id: string) {

 

    this._productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.toastr.success('Product deleted successfully', 'Success',{
          timeOut: 3000,
          positionClass: 'toast-top-right',
          closeButton: true,
          progressBar: true
        });
        
      },
      error: (err) => {

           this.toastr.error('Failed to delete', 'Error',{

            timeOut: 3000,
            positionClass: 'toast-top-right',
            closeButton: true,
            progressBar: true
           });
       
        }
      });
    }
}
