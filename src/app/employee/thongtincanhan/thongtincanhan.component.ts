import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { PositionService } from '../../core/services/position.service';
import { AuthService } from '../../core/auth/auth.service';
import { RouterModule } from '@angular/router';

// Interface
export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  email: string;
  nation: string;
  phoneNumber: string;
  hireDate: string;
  departmentId: number;
  positionId: number;
}

export interface Position {
  positionId: number;
  positionName: string;
  level: string;
}

@Component({
  selector: 'app-thongtincanhan',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './thongtincanhan.component.html',
  styleUrl: './thongtincanhan.component.css'
})
export class ThongtincanhanComponent implements OnInit {

  employee?: Employee & { positionName?: string; level?: string };

  constructor(
    private employeeApiService: EmployeeService,
    private positionApiService: PositionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentEmployee();
  }

  loadCurrentEmployee(): void {
    const username = this.authService.getUser()?.username;

    if (username) {
      this.employeeApiService.getEmployeeByUsername(username).subscribe({
        next: (emp) => {
          this.positionApiService.getPositionFromId(emp.positionId).subscribe({
            next: (pos) => {
              this.employee = {
                ...emp,
                positionName: pos.positionName,
                level: pos.level
              };
            },
            error: (err) => {
              console.error('Lỗi khi lấy thông tin chức vụ:', err);
              this.employee = emp; // fallback nếu không có vị trí
            }
          });
        },
        error: (err) => {
          console.error('Lỗi khi lấy thông tin nhân viên:', err);
        }
      });
    } else {
      console.warn('Chưa đăng nhập');
    }
  }
  
  


}
