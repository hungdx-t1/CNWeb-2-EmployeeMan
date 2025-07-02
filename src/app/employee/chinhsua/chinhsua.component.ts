import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Gọi service
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-chinhsua',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chinhsua.component.html',
  styleUrls: ['./chinhsua.component.css']
})

// Component để chỉnh sửa thông tin nhân viên (Admin/manager/HR)
export class ChinhsuaComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: number;
  departmentId!: number;
  positionId!: number;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      ho: [''],
      ten: [''],
      ngaySinh: [''],
      gioiTinh: [''],
      ngayVaoLam: [''],
      soDienThoai: [''],
      email: [''],
      quocTich: [''],
      diaChi: ['']
    });

    this.loadCurrentEmployee();
  }

  loadCurrentEmployee(): void {
    const username = this.authService.getUser()?.username;

    if (username) {
      this.employeeService.getEmployeeByUsername(username).subscribe({
        next: (data) => {
          this.employeeId = data.employeeId;
          this.departmentId = data.departmentId; 
          this.positionId = data.positionId;

          this.employeeForm.patchValue({
            ho: data.firstName,
            ten: data.lastName,
            ngaySinh: data.dateOfBirth,
            gioiTinh: data.gender,
            ngayVaoLam: data.hireDate,
            soDienThoai: data.phoneNumber,
            email: data.email,
            quocTich: data.nation,
            diaChi: data.address
          });
        },
        error: (err) => {
          console.error('Không thể lấy thông tin nhân viên:', err);
        }
      });
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    const parts = date.split('/');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
    return date;
  }

  uupdateEmployee(): void {
  const formValue = this.employeeForm.value;

  const payload = {
    employeeId: this.employeeId,
    firstName: formValue.ho,
    lastName: formValue.ten,
    dateOfBirth: this.formatDate(formValue.ngaySinh),
    gender: formValue.gioiTinh,
    hireDate: this.formatDate(formValue.ngayVaoLam),
    phoneNumber: formValue.soDienThoai,
    email: formValue.email,
    nation: formValue.quocTich,
    address: formValue.diaChi,
    departmentId: this.departmentId, 
    positionId: this.positionId 
  };

  console.log('Payload gửi đi:', payload); // 👈 Debug xem dữ liệu gửi có đúng không

  this.employeeService.updateEmployee(this.employeeId, payload).subscribe({
    next: () => {
      alert('✅ Cập nhật thành công!');
      this.router.navigate(['/main/dashboard']);
    },
    error: (err) => {
      const errorMessage =
        err?.error?.message || err?.message || 'Không rõ nguyên nhân';
      alert('❌ Cập nhật thất bại: ' + errorMessage);
      console.error('Lỗi cập nhật:', err);
    }
  });
  }

}
