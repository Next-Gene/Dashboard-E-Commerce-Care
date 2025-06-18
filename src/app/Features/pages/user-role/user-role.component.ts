import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRoleService } from '../../../core/service/user-role.service';
import { ChangeUserRoleRequest } from '../../../core/interfaces/user-role';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-role.component.html',
  styleUrl: './user-role.component.scss'
})
export class UserRoleComponent implements OnDestroy {
  roleForm!: FormGroup;
  currentRoles: string[] = [];
  availableRoles: string[] = [];
  isLoading: boolean = false;
  isSearching: boolean = false;
  searchTimeout: any;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userRoleService: UserRoleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRolesData();
    this.setupEmailValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  setupEmailValidation(): void {
    this.roleForm.get('email')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(email => {
        if (email && this.roleForm.get('email')?.valid) {
          this.getUserRoles();
        }
      });
  }

  loadRolesData(): void {


    Promise.all([
      this.getAvailableRoles(),
      this.getUserRoles()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  getUserRoles(): void {
    const email = this.roleForm.get('email')?.value;
    if (!email) return;

    this.isSearching = true;
    this.toastr.info('Searching for user roles...', 'Please wait', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });

    this.userRoleService.getUserRoles(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.currentRoles = res.roles;
          if (this.currentRoles.length === 0) {
            this.toastr.warning('No roles found for this user', 'Information', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
          } else {
            this.toastr.success(`Found ${this.currentRoles.length} role(s)`, 'Success', {
              timeOut: 2000,
              positionClass: 'toast-top-right'
            });
          }
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Failed to load user roles', 'Error', {
            timeOut: 4000,
            positionClass: 'toast-top-right'
          });
          console.error(err);
          this.currentRoles = [];
        },
        complete: () => {
          this.isSearching = false;
        }
      });
  }

  getAvailableRoles(): Promise<void> {
    return new Promise((resolve) => {
      this.userRoleService.getAvailableRoles()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.availableRoles = res;
            if (this.availableRoles.length === 0) {
              this.toastr.warning('No roles available in the system', 'Warning', {
                timeOut: 3000,
                positionClass: 'toast-top-right'
              });
            } else {
              this.toastr.success(`Loaded ${this.availableRoles.length} available role(s)`, 'Success', {
                timeOut: 2000,
                positionClass: 'toast-top-right'
              });
            }
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Failed to load available roles', 'Error', {
              timeOut: 4000,
              positionClass: 'toast-top-right'
            });
            console.error(err);
            this.availableRoles = [];
          },
          complete: () => resolve()
        });
    });
  }

  changeUserRole(): void {
    if (this.roleForm.invalid) {
      this.markFormGroupTouched(this.roleForm);
      this.toastr.error('Please fill in all required fields correctly', 'Validation Error', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      return;
    }

    const payload: ChangeUserRoleRequest = {
      email: this.roleForm.get('email')?.value,
      NewRole: this.roleForm.get('role')?.value,
    };

    this.isLoading = true;
    this.toastr.info('Updating user role...', 'Please wait', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });

    this.userRoleService.changeUserRole(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Role updated successfully!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
          this.getUserRoles();
          this.roleForm.get('role')?.reset();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Failed to update role', 'Error', {
            timeOut: 4000,
            positionClass: 'toast-top-right'
          });
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.roleForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.roleForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}

