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
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  Categories: Category[] = [];
  addForm!: FormGroup;
  updateForm!: FormGroup;
  selectedCategory!: Category;
  selectedFile!: File;

  
  showUpdateModal = false;
  showDeleteModal = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getCategories();

    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.Categories = data;
    });
  }

 

  closeModals() {
 
    this.showUpdateModal = false;
    this.showDeleteModal = false;
  }

  submitAdd() {
    if (this.addForm.invalid) return;
    this.categoryService.addCategory(this.addForm.value).subscribe((newCategory) => {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('photo', this.selectedFile);
        this.categoryService.uploadPhotoById(newCategory.id.toString(), formData).subscribe(() => {
          this.getCategories();
          this.closeModals();
        });
      } else {
        this.getCategories();
        this.closeModals();
      }
    });
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
