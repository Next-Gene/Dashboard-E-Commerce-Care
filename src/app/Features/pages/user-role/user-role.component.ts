import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRoleService } from '../../../core/service/user-role.service';
import { ChangeUserRoleRequest } from '../../../core/interfaces/user-role';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-role',
  imports: [ReactiveFormsModule],
  templateUrl: './user-role.component.html',
  styleUrl: './user-role.component.scss'
})
export class UserRoleComponent implements OnDestroy {
  roleForm!: FormGroup;
  currentRoles: string[] = [];
  availableRoles: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userRoleService: UserRoleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRolesData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  loadRolesData(): void {
    this.getAvailableRoles();
    this.getUserRoles();
  }

  getUserRoles(): void {
    const email = this.roleForm.get('email')?.value;
    if (!email) return;

    this.userRoleService.getUserRoles(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.currentRoles = res.roles;
        },
        error: (err) => {
          this.toastr.error('Failed to load user roles', 'Error');
          console.error(err);
        },
      });
  }

  getAvailableRoles(): void {
    this.userRoleService.getAvailableRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.availableRoles = res;
        },
        error: (err) => {
          this.toastr.error('Failed to load available roles', 'Error');
          console.error(err);
        },
      });
  }

  changeUserRole(): void {
    if (this.roleForm.invalid) return;

    const payload: ChangeUserRoleRequest = {
      email: this.roleForm.get('email')?.value,
      role: this.roleForm.get('role')?.value,
    };

    this.userRoleService.changeUserRole(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Role changed successfully!', 'Success');
          this.getUserRoles();
        },
        error: (err) => {
          this.toastr.error('Failed to change role', 'Error');
          console.error(err);
        },
      });
  }
}

