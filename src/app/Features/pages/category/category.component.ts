import { Component, OnInit } from '@angular/core';
import { Category } from '../../../core/interfaces/category';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/service/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class CategoryComponent implements OnInit {
  Categories: Category[] = [];
  addForm!: FormGroup;
  updateForm!: FormGroup;
  selectedCategory!: Category;
  selectedFile!: File;
  
  showAddModal = false;
  showUpdateModal = false;
  showDeleteModal = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.initializeForms();
  }

  initializeForms() {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      slug: ['', [Validators.required, Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')]]
    });

    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      slug: ['', [Validators.required, Validators.pattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')]]
    });

    // Subscribe to name changes to auto-generate slug
    this.addForm.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const slug = this.generateSlug(name);
        this.addForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.Categories = data;
      console.log(this.Categories);
    });
  }

  openAddModal() {
    this.showAddModal = true;
    this.addForm.reset();
    this.selectedFile = null!;
  }

  closeModals() {
    this.showAddModal = false;
    this.showUpdateModal = false;
    this.showDeleteModal = false;
  }
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      console.log('Selected File:', {
        name: this.selectedFile.name,
        type: this.selectedFile.type,
        size: this.selectedFile.size
      });
    }
  }
  submitAdd() {
    if (this.addForm.invalid) return;
  
    const categoryData = this.addForm.value;
  
    if (this.selectedFile) {
      this.categoryService.addCategoryWithPhoto(categoryData, this.selectedFile).subscribe({
        next: (category) => {
          console.log('✅ Category and photo added:', category);
          if (category && category.photoUrl) {
            // Add the new category to the list
            this.Categories = [...this.Categories, category];
            this.closeModals();
          } else {
            console.error('❌ Category created but photo URL is missing');
            this.getCategories(); // Refresh the list to get the latest data
            this.closeModals();
          }
        },
        error: (err) => {
          console.error('❌ Error:', err);
          // Show error message to user
          this.getCategories(); // Refresh the list to ensure consistency
          this.closeModals();
        }
      });
    } else {
      this.categoryService.addCategory(categoryData).subscribe({
        next: (res) => {
          console.log('✅ Category added:', res);
          this.getCategories();
          this.closeModals();
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.closeModals();
        }
      });
    }
  }
  
  

  onUpdateCategory(category: Category) {
    this.selectedCategory = category;
    this.updateForm.patchValue({
      name: category.name,
      description: category.description,
    });
    this.showUpdateModal = true;
  }

  submitUpdate() {
    if (this.updateForm.invalid) return;
    this.categoryService
      .updateCategory(this.selectedCategory.id.toString(), this.updateForm.value)
      .subscribe(() => {
        this.getCategories();
        this.closeModals();
      });
  }

  onDeleteCategory(category: Category) {
    this.selectedCategory = category;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.categoryService.deleteCategory(this.selectedCategory.id.toString()).subscribe(() => {
      this.getCategories();
      this.closeModals();
    });
  }
}
