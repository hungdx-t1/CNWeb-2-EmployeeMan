import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../core/services/leave.service';
import { AuthService } from '../../core/auth/auth.service';
import { Leave } from '../../core/models/leave.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-request',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {
  leaveForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(250)]]
    });
  }

  submitLeave(): void {
    if (this.leaveForm.invalid) return;

    const user = this.authService.getUser();
    const leaveData: Partial<Leave> = {
      employeeId: user?.employeeId,
      leaveType: this.leaveForm.value.leaveType,
      startDate: this.leaveForm.value.startDate,
      endDate: this.leaveForm.value.endDate,
      reason: this.leaveForm.value.reason,
      status: 'Pending',
    };

    this.leaveService.createLeave(leaveData).subscribe({
      next: () => {
        this.successMessage = 'Đơn nghỉ phép đã được gửi thành công.';
        this.leaveForm.reset();
        this.leaveForm.markAsPristine();
      },
      error: (err) => {
        this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
        console.error(err);
      }
    });
  }
}
