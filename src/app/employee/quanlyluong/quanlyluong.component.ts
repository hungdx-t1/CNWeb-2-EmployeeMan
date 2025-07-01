// nhanvien.component.ts (cập nhật để hiển thị bảng lương chi tiết khi click vào tên)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { SalaryService } from '../../core/services/salary.service';
import { PositionService } from '../../core/services/position.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { Employee } from '../../core/models/employee.model';
import { Salary } from '../../core/models/salary.model';
import { Position } from '../../core/models/position.model';
import { Attendance } from '../../core/models/attendance.model';

interface SalaryRow {
  month: number;
  year: number;
  daysWorked: number;
  baseSalary: number;
  bonus: number;
  total: number;
}

@Component({
  selector: 'app-quanlyluong',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quanlyluong.component.html',
  styleUrls: ['./quanlyluong.component.css']
})
export class QuanLyLuongComponent implements OnInit {
  employees: Employee[] = [];
  filteredList: Employee[] = [];
  salaries: { [employeeId: number]: Salary } = {};
  workdays: { [employeeId: number]: number } = {};
  positions: { [positionId: number]: Position } = {};

  searchTerm: string = '';
  selectedEmployee: Employee | null = null;
  salaryTable: SalaryRow[] = [];

  showSalaryForm: { [employeeId: number]: boolean } = {};
  formData: { [employeeId: number]: { effectiveDate: string, baseSalary: number, bonus: number } } = {};

  constructor(
    private employeeService: EmployeeService,
    private salaryService: SalaryService,
    private attendanceService: AttendanceService,
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe(emps => {
      this.employees = emps;
      this.filteredList = [...emps];
      emps.forEach(emp => this.loadPosition(emp.positionId));
      this.filteredList.forEach(emp => {
        this.loadSalary(emp.employeeId);
        this.loadWorkdays(emp.employeeId);
      });
    });
  }

  loadPosition(positionId: number): void {
    if (!this.positions[positionId]) {
      this.positionService.getPositionFromId(positionId).subscribe(pos => {
        this.positions[positionId] = pos;
      });
    }
  }

  toggleSalaryForm(empId: number): void {
    this.showSalaryForm[empId] = !this.showSalaryForm[empId];
    this.formData[empId] = { effectiveDate: '', baseSalary: 0, bonus: 0 };
  }

  submitSalary(empId: number): void {
    const form = this.formData[empId];
    if (form.baseSalary > 0) {
      const newSalary: Salary = {
        salaryId: 0,
        employeeId: empId,
        effectiveDate: form.effectiveDate,
        baseSalary: form.baseSalary,
        bonus: form.bonus
      };
      this.salaryService.addSalary(newSalary).subscribe(() => {
        this.loadSalary(empId);
        this.loadWorkdays(empId);
        this.toggleSalaryForm(empId);
      });
    }
  }

  getTotalSalary(empId: number): number {
    const salary = this.salaries[empId];
    const workday = this.workdays[empId] ?? 0;
    if (!salary || workday === 0) return 0;

    const eff = new Date(salary.effectiveDate);
    const now = new Date();
    const bonus = (eff.getFullYear() === now.getFullYear() && eff.getMonth() === now.getMonth())
      ? salary.bonus
      : 0;

    return Math.round((salary.baseSalary / 30) * workday + bonus);
  }

  getPositionName(emp: Employee): string {
    return this.positions[emp.positionId]?.positionName ?? '...';
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredList = this.employees.filter(emp => {
      const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      return (
        emp.employeeId.toString().includes(term) ||
        name.includes(term)
      );
    });

    this.filteredList.forEach(emp => {
      this.loadSalary(emp.employeeId);
      this.loadWorkdays(emp.employeeId);
    });
  }

  loadSalary(employeeId: number): void {
    this.salaryService.getSalariesByEmployee(employeeId).subscribe(salaries => {
      const filtered = salaries.filter(s => new Date(s.effectiveDate) <= new Date());
      if (filtered.length > 0) {
        const latest = filtered.reduce((a, b) => new Date(a.effectiveDate) > new Date(b.effectiveDate) ? a : b);
        this.salaries[employeeId] = latest;
      } else {
        delete this.salaries[employeeId];
      }
    });
  }

  loadWorkdays(employeeId: number): void {
    this.attendanceService.getAttendanceByEmployeeId(employeeId).subscribe(att => {
      const now = new Date();
      const count = att.filter(a => {
        if (!a.checkIn || !a.checkOut) return false;
        const date = new Date(a.date);
        if (date.getFullYear() !== now.getFullYear() || date.getMonth() !== now.getMonth()) return false;
        const [ciH, ciM, ciS] = a.checkIn.split(':').map(Number);
        const [coH, coM, coS] = a.checkOut.split(':').map(Number);
        const duration = (coH * 3600 + coM * 60 + coS) - (ciH * 3600 + ciM * 60 + ciS);
        return (duration / 3600) >= 8;
      }).length;
      this.workdays[employeeId] = count;
    });
  }

  selectEmployee(emp: Employee): void {
    this.selectedEmployee = emp;
    this.salaryService.getSalariesByEmployee(emp.employeeId).subscribe(salaries => {
      this.attendanceService.getAttendanceByEmployeeId(emp.employeeId).subscribe(attendances => {
        this.salaryTable = this.buildSalaryTable(emp.hireDate, salaries, attendances);
      });
    });
  }

  buildSalaryTable(hireDate: string, salaries: Salary[], attendances: Attendance[]): SalaryRow[] {
    const hire = new Date(hireDate);
    const now = new Date();
    const table: SalaryRow[] = [];

    salaries.sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

    const salaryMap = new Map<string, { base: number, bonus: number }>();
    for (let s of salaries) {
      const eff = new Date(s.effectiveDate);
      const key = `${eff.getFullYear()}-${eff.getMonth() + 1}`;
      salaryMap.set(key, { base: s.baseSalary, bonus: s.bonus });
    }

    let current = new Date(hire.getFullYear(), hire.getMonth(), 1);
    let lastBase = 0;
    let lastBonusMonth = new Set();

    while (current <= now) {
      const month = current.getMonth() + 1;
      const year = current.getFullYear();
      const key = `${year}-${month}`;
      if (salaryMap.has(key)) {
        lastBase = salaryMap.get(key)!.base;
        lastBonusMonth.add(key);
      }

      const workDays = attendances.filter(a => {
        const d = new Date(a.date);
        if (!a.checkIn || !a.checkOut) return false;
        const checkIn = new Date(d);
        const [ciH, ciM, ciS] = a.checkIn.split(':').map(Number);
        checkIn.setHours(ciH, ciM, ciS);
        const checkOut = new Date(d);
        const [coH, coM, coS] = a.checkOut.split(':').map(Number);
        checkOut.setHours(coH, coM, coS);
        return d.getMonth() + 1 === month && d.getFullYear() === year &&
          (checkOut.getTime() - checkIn.getTime()) >= 8 * 60 * 60 * 1000;
      }).length;

      const bonus = lastBonusMonth.has(key) ? salaryMap.get(key)?.bonus || 0 : 0;

      table.push({
        month,
        year,
        daysWorked: workDays,
        baseSalary: lastBase / 30,
        bonus,
        total: (lastBase / 30) * workDays
      });

      current.setMonth(current.getMonth() + 1);
    }

    return table.reverse();
  }

  filteredEmployees(): Employee[] {
    return this.filteredList;
  }

  isBonusInSelectedMonth(empId: number): boolean {
    const salary = this.salaries[empId];
    if (!salary) return false;
    const eff = new Date(salary.effectiveDate);
    const now = new Date();
    return eff.getFullYear() === now.getFullYear() && eff.getMonth() === now.getMonth();
  }
}
