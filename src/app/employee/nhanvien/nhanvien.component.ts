// nhanvien.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { PositionService } from '../../core/services/position.service';
import { Employee } from '../../core/models/employee.model';
import { Position } from '../../core/models/position.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nhanvien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nhanvien.component.html',
  styleUrl: './nhanvien.component.css'
})
export class NhanVienComponent implements OnInit {
  employees: (Employee & { positionName?: string, level?: string })[] = [];
  filteredEmployees: (Employee & { positionName?: string, level?: string })[] = [];
  selectedEmployee?: Employee & { positionName?: string, level?: string };

  searchTerm: string = '';
  editDropdownId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (list) => {
        let temp: (Employee & { positionName?: string, level?: string })[] = [];
        let pending = list.length;

        list.forEach(emp => {
          this.positionService.getPositionFromId(emp.positionId).subscribe({
            next: (pos) => {
              temp.push({
                ...emp,
                positionName: pos.positionName,
                level: pos.level
              });
              pending--;
              if (pending === 0) {
                this.employees = temp.sort((a, b) => a.employeeId - b.employeeId);
                this.applyFilter();
              }
            },
            error: () => {
              temp.push(emp);
              pending--;
              if (pending === 0) {
                this.employees = temp.sort((a, b) => a.employeeId - b.employeeId);
                this.applyFilter();
              }
            }
          });
        });
      },
      error: (err) => console.error('Lỗi khi lấy danh sách nhân viên:', err)
    });
  }

  applyFilter(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp => {
      const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      return (
        name.includes(search) ||
        emp.employeeId.toString().includes(search) ||
        (emp.positionName?.toLowerCase().includes(search))
      );
    });
  }

  showDetails(emp: Employee & { positionName?: string; level?: string }): void {
    this.selectedEmployee = emp;
  }

  toggleEditDropdown(empId: number): void {
    this.editDropdownId = this.editDropdownId === empId ? null : empId;
  }

  changePosition(emp: Employee, newPositionId: number): void {
    if (emp.positionId === newPositionId) return;

    const updatedEmp = { ...emp, positionId: newPositionId };

    this.employeeService.updateEmployee(emp.employeeId, updatedEmp).subscribe({
      next: () => {
        emp.positionId = newPositionId;
        this.editDropdownId = null;
        this.loadEmployees();
      },
      error: () => {
        alert('❌ Cập nhật chức vụ thất bại.');
      }
    });
  }

  deleteEmployee(emp: Employee): void {
    if (confirm(`Bạn có chắc muốn xoá nhân viên ${emp.firstName} ${emp.lastName}?`)) {
      this.employeeService.deleteEmployee(emp.employeeId).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.employeeId !== emp.employeeId);
          this.applyFilter();
          alert('Đã xoá thành công.');
        },
        error: () => alert('Xoá thất bại.')
      });
    }
  }

  positionOptions = [
    { value: 1, label: 'Trưởng phòng' },
    { value: 2, label: 'Nhân viên' },
    { value: 3, label: 'Phó phòng' }
  ];
}
