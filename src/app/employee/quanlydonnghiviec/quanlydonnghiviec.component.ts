import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveService } from '../../core/services/leave.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

// leave.model.ts
export interface Leave {
  leaveId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  employeeId: number;

  // thêm nếu muốn đính kèm thông tin nhân viên
  employee?: Employee;
}

@Component({
  selector: 'app-quanlydonnghiviec',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quanlydonnghiviec.component.html',
  styleUrls: ['./quanlydonnghiviec.component.css']
})



export class QuanlydonnghiviecComponent implements OnInit{
  searchId: string = '';
  leaves: Leave[] = [];
  selectedLeaveId: number | null = null;
  employee: Employee | null = null;

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.performSearch(); // tự động load toàn bộ dữ liệu khi vào trang
  }

  performSearch(): void {
  const empId = Number(this.searchId);

  if (!empId) {
    this.employee = null;

    forkJoin({
      leaves: this.leaveService.getAllLeaves(),
      employees: this.employeeService.getAllEmployees()
    }).subscribe({
      next: ({ leaves, employees }) => {
        const mergedLeaves = leaves.map(leave => {
          const emp = employees.find(e => e.employeeId === leave.employeeId);
          return { ...leave, employee: emp };
        });

        this.leaves = mergedLeaves.sort((a, b) => b.leaveId - a.leaveId);
      },
      error: () => {
        this.leaves = [];
      }
    });

    return;
  }

  // Có nhập ID nhân viên
  this.employeeService.getEmployeeByUserId(empId).subscribe({
    next: (emp) => {
      this.employee = emp;
      this.leaveService.getAllLeavesByEmployee(empId).subscribe({
        next: (leaves) => {
          this.leaves = leaves
            .sort((a, b) => b.leaveId - a.leaveId)
            .map(leave => ({ ...leave, employee: emp }));
        },
        error: () => this.leaves = []
      });
    },
    error: () => {
      this.employee = null;
      this.leaves = [];
    }
  });
}


updateLeaveStatus(leaveId: number, newStatus: 'Approved' | 'Rejected'): void {
  this.leaveService.updateLeaveStatus(leaveId, newStatus).subscribe({
    next: () => {
      // Cập nhật local để hiển thị ngay trên UI
      const leave = this.leaves.find(l => l.leaveId === leaveId);
      if (leave) {
        leave.status = newStatus;
      }
    },
    error: (err) => {
      console.error('Lỗi cập nhật trạng thái:', err);
      alert(`Không thể cập nhật trạng thái.\nMã lỗi: ${err.status}\nThông báo: ${err.message || err.error}`);
    }
  });
}



  toggleDetails(leaveId: number): void {
    this.selectedLeaveId = this.selectedLeaveId === leaveId ? null : leaveId;
  }
}
