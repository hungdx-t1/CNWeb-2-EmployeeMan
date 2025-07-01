import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { SalaryService } from '../../core/services/salary.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { Employee } from '../../core/models/employee.model';
import { Salary } from '../../core/models/salary.model';
import { Attendance } from '../../core/models/attendance.model';

@Component({
  selector: 'app-hieusuat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hieusuat.component.html',
  styleUrls: ['./hieusuat.component.css']
})
export class HieuSuatComponent implements OnInit {
  performance: { employeeId: number, fullName: string, totalDays: number, totalSalary: number }[] = [];
  grandTotalDays: number = 0;
  grandTotalSalary: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private salaryService: SalaryService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe(employees => {
      const allPromises = employees.map(emp =>
        Promise.all([
          this.salaryService.getSalariesByEmployee(emp.employeeId).toPromise(),
          this.attendanceService.getAttendanceByEmployeeId(emp.employeeId).toPromise()
        ]).then(([salariesRaw, attendancesRaw]) => {
          const salaries: Salary[] = salariesRaw ?? [];
          const attendances: Attendance[] = attendancesRaw ?? [];

          let totalDays = 0;
          let totalSalary = 0;
          let lastBase = 0;

          salaries.sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

          for (let s of salaries) {
            lastBase = s.baseSalary;
            totalSalary += s.bonus;
          }

          const count = attendances.filter(a => {
            if (!a.checkIn || !a.checkOut) return false;
            const [ciH, ciM, ciS] = a.checkIn.split(':').map(Number);
            const [coH, coM, coS] = a.checkOut.split(':').map(Number);
            const duration = (coH * 3600 + coM * 60 + coS) - (ciH * 3600 + ciM * 60 + ciS);
            return (duration / 3600) >= 8;
          }).length;

          totalDays = count;
          totalSalary += Math.round((lastBase / 30) * count);

          this.performance.push({
            employeeId: emp.employeeId,
            fullName: `${emp.firstName} ${emp.lastName}`,
            totalDays,
            totalSalary
          });

          this.grandTotalDays += totalDays;
          this.grandTotalSalary += totalSalary;
        })
      );

      Promise.all(allPromises).then(() => {
        this.performance.sort((a, b) => b.totalSalary - a.totalSalary);
      });
    });
  }
}
