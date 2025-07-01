import { Component, OnInit } from '@angular/core';
import { Employee } from '../../core/models/employee.model';
import { Salary } from '../../core/models/salary.model';
import { Attendance } from '../../core/models/attendance.model';
import { Leave } from '../../core/models/leave.model';
import { SalaryService } from '../../core/services/salary.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { LeaveService } from '../../core/services/leave.service';
import { EmployeeService } from '../../core/services/employee.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { PositionService } from '../../core/services/position.service';
import { Position } from '../../core/models/position.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  employee?: Employee;
  position?: Position;
  todayAttendance?: Attendance;
  pendingLeaves: Leave[] = [];

  daysWorkedInMonth: number = 0;
  salaryPerDay: number = 0;
  bonusThisMonth: number = 0;
  totalSalaryThisMonth: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private salaryService: SalaryService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private authService: AuthService,
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    const username = this.authService.getUser().username;

    if (username) {
      this.employeeService.getEmployeeByUsername(username).subscribe({
        next: (emp) => {
          this.employee = emp;
          this.loadDashboardData(emp.employeeId, emp.hireDate);
        },
        error: (err) => console.error('Lỗi khi lấy thông tin nhân viên:', err)
      });
    }
  }

  loadDashboardData(empId: number, hireDate: string): void {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentKey = `${currentYear}-${currentMonth}`;

    this.attendanceService.getTodayAttendance(empId).subscribe(att => this.todayAttendance = att);
    this.leaveService.getPendingLeaves(empId).subscribe(leaves => this.pendingLeaves = leaves);

    this.salaryService.getSalariesByEmployee(empId).subscribe(salaries => {
      salaries.sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

      let currentBaseSalary = 0;
      let currentBonus = 0;

      for (let s of salaries) {
        const eff = new Date(s.effectiveDate);
        const effKey = `${eff.getFullYear()}-${eff.getMonth() + 1}`;
        if (eff.getTime() <= now.getTime()) {
          currentBaseSalary = s.baseSalary;
          if (effKey === currentKey) currentBonus = s.bonus;
        }
      }

      this.salaryPerDay = currentBaseSalary / 30;
      this.bonusThisMonth = currentBonus;

      this.attendanceService.getAttendanceByEmployeeId(empId).subscribe(attendances => {
        const workDays = attendances.filter(a => {
          if (!a.checkIn || !a.checkOut) return false;

          const d = new Date(a.date);
          if (d.getMonth() + 1 !== currentMonth || d.getFullYear() !== currentYear) return false;

          const [ciH, ciM, ciS] = a.checkIn.split(':').map(Number);
          const [coH, coM, coS] = a.checkOut.split(':').map(Number);

          const checkIn = new Date(d);
          const checkOut = new Date(d);
          checkIn.setHours(ciH, ciM, ciS);
          checkOut.setHours(coH, coM, coS);

          return (checkOut.getTime() - checkIn.getTime()) >= 8 * 60 * 60 * 1000;
        }).length;

        this.daysWorkedInMonth = workDays;
        this.totalSalaryThisMonth = Math.round(this.salaryPerDay * workDays + this.bonusThisMonth);
      });
    });
  }

  get fullName(): string {
    return `${this.employee?.firstName ?? ''} ${this.employee?.lastName ?? ''}`.trim();
  }

  getPositionName(): string {
    const positionId = this.employee?.positionId;
    if (positionId) {
      this.positionService.getPositionFromId(positionId).subscribe({
        next: (pos) => (this.position = pos),
        error: (err) => console.error('Lỗi khi lấy thông tin chức vụ:', err)
      });
      return this.position?.positionName ?? '';
    } else {
      return 'Chưa xác định';
    }
  }
}
