import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phanquyen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phanquyen.component.html',
  styleUrls: ['./phanquyen.component.css']
})
export class PhanquyenComponent implements OnInit {
  employees: (any & { username?: string; userId?: number; role?: string })[] = [];
  filteredEmployees: (any & { username?: string; userId?: number; role?: string })[] = [];
  searchId: string = '';
  currentUserRole: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.getCurrentUser()?.role || null;
    this.loadData();
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  loadData(): void {
    forkJoin({
      employees: this.employeeService.getAllEmployees(),
      users: this.userService.getall()
    }).subscribe({
      next: ({ employees, users }) => {
        this.employees = employees.map(emp => {
          const matchingUser = users.find(u => u.employeeId === emp.employeeId);
          return {
            ...emp,
            username: matchingUser?.username,
            userId: matchingUser?.userId,
            role: matchingUser?.role || 'N/A'
          };
        });
        this.filteredEmployees = []; // Xóa kết quả tìm kiếm khi load lại
      },
      error: (err) => {
        console.error('Lỗi tải dữ liệu:', err);
      }
    });
  }

  updateRole(userId: number, newRole: string, currentRole: string) {
  this.userService.updateUserRole(userId, newRole).subscribe({
    next: () => {
      this.loadData();

      const currentUser = this.getCurrentUser();

      if (
        currentUser?.userId === userId &&
        newRole !== 'Admin'
      ) {
        alert('Bạn không còn là Admin. Chuyển về Trang chủ.');
        this.router.navigate(['/main/dashboard']);
      }
    },
    error: err => {
      let errorMsg = 'Cập nhật role thất bại!';
      if (err?.error?.message) {
        errorMsg += '\nLỗi: ' + err.error.message;
      } else if (err?.message) {
        errorMsg += '\nLỗi: ' + err.message;
      } else {
        errorMsg += '\nVui lòng kiểm tra lại kết nối hoặc thử lại sau.';
      }

      alert(errorMsg);
      console.error('Chi tiết lỗi cập nhật role:', err);
    }
  });
  }


  getButtonClass(currentRole: string, buttonRole: string): string {
    return currentRole === buttonRole ? 'active-role' : 'inactive-role';
  }

  performSearch(): void {
    const search = this.searchId.trim();
    if (search === '') {
      this.filteredEmployees = [];
    } else {
      this.filteredEmployees = this.employees.filter(emp =>
        emp.employeeId?.toString().includes(search)
      );
    }
  }
}
