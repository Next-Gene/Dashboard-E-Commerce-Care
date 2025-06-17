import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Brandsbody, BrandsResponse } from '../../../core/interfaces/Brands';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BrandsService } from '../../../core/services/Brands.service';

@Component({
  selector: 'app-manage-brands',
  templateUrl: './manage-brands.component.html',
  styleUrls: ['./manage-brands.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ManageBrandsComponent implements OnInit, OnDestroy {
  brands: BrandsResponse[] = [];
  filteredBrands: BrandsResponse[] = [];
  showBrandModal = false;
  showDeleteModal = false;
  isAddMode = true;
  selectedBrand: BrandsResponse | null = null;
  brandToDelete: number | null = null;
  searchTerm = '';
  private destroy$ = new Subject<void>();
  brandForm: FormGroup;
  Math = Math; // Add Math to component for template access
  private toastr = inject(ToastrService);

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private _brandsService: BrandsService,
    private fb: FormBuilder
  ) {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.loadBrands();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBrands() {
    this._brandsService.getBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.brands = Array.isArray(response) ? response : [response];
          this.filteredBrands = [...this.brands];
          this.updatePagination();
        },
        error: (error) => {
          console.error('Error loading brands:', error);
          this.toastr.error('Failed to load brands', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true
          });
        }
      });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.filteredBrands = this.brands.filter(brand => 
      brand.name.toLowerCase().includes(value.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  openBrandModal(brand?: BrandsResponse) {
    this.isAddMode = !brand;
    this.selectedBrand = brand || null;
    if (brand) {
      this.brandForm.patchValue({
        name: brand.name
      });
    } else {
      this.brandForm.reset();
    }
    this.showBrandModal = true;
  }

  closeBrandModal() {
    this.showBrandModal = false;
    this.brandForm.reset();
    this.selectedBrand = null;
  }

  openDeleteModal(id: number) {
    this.brandToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.brandToDelete = null;
  }

  confirmDelete() {
    if (this.brandToDelete) {
      this._brandsService.deleteBrand(this.brandToDelete)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadBrands();
            this.closeDeleteModal();
            this.toastr.success('Brand deleted successfully', 'Success', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });
          },
          error: (error) => {
            console.error('Error deleting brand:', error);
            this.toastr.error('Failed to delete brand', 'Error', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });
          }
        });
    }
  }

  submitBrand() {
    if (this.brandForm.valid) {
      const brandData: Brandsbody = this.brandForm.value;
      
      if (this.isAddMode) {
        this._brandsService.addBrand(brandData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadBrands();
              this.closeBrandModal();
              this.toastr.success('Brand added successfully', 'Success', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true
              });
            },
            error: (error) => {
              console.error('Error adding brand:', error);
              this.toastr.error('Failed to add brand', 'Error', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true
              });
            }
          });
      } else if (this.selectedBrand) {
        this._brandsService.updateBrand(this.selectedBrand.id, brandData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadBrands();
              this.closeBrandModal();
              this.toastr.success('Brand updated successfully', 'Success', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true
              });
            },
            error: (error) => {
              console.error('Error updating brand:', error);
              this.toastr.error('Failed to update brand', 'Error', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true
              });
            }
          });
      }
    } else {
      this.toastr.warning('Please fill in all required fields correctly', 'Validation Error', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    }
  }

  // Pagination methods
  updatePagination() {
    this.totalItems = this.filteredBrands.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedBrands() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredBrands.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.itemsPerPage = Number(value);
    this.currentPage = 1;
    this.updatePagination();
  }
}
