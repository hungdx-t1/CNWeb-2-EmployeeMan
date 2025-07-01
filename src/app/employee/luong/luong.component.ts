import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { SalaryService } from '../../core/services/salary.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { Salary } from '../../core/models/salary.model';
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
  selector: 'app-luong',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './luong.component.html',
  styleUrls: ['./luong.component.css']
})
export class LuongComponent implements OnInit {
  salaryTable: SalaryRow[] = [];

  constructor(
    private employeeService: EmployeeService,
    private salaryService: SalaryService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.employeeService.getCurrentEmployee().subscribe(emp => {
      this.salaryService.getSalariesByEmployee(emp.employeeId).subscribe(salaries => {
        this.attendanceService.getAttendanceByEmployeeId(emp.employeeId).subscribe(attendances => {
          this.salaryTable = this.buildSalaryTable(emp.hireDate, salaries, attendances);
        });
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

      // Tính số ngày công đủ (>= 8h)
      const workDays = attendances.filter(a => {
        const d = new Date(a.date);
        if (!a.checkIn || !a.checkOut) return false;

        // Ghép check-in với ngày
        const checkInParts = a.checkIn.split(':').map(Number);
        const checkIn = new Date(d);
        checkIn.setHours(checkInParts[0], checkInParts[1], checkInParts[2]);

        // Ghép check-out với ngày
        const checkOutParts = a.checkOut.split(':').map(Number);
        const checkOut = new Date(d);
        checkOut.setHours(checkOutParts[0], checkOutParts[1], checkOutParts[2]);

        const isSameMonth = d.getMonth() + 1 === month && d.getFullYear() === year;
        const hasFullWorkHours = (checkOut.getTime() - checkIn.getTime()) >= 8 * 60 * 60 * 1000;

        return isSameMonth && hasFullWorkHours;
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
}
