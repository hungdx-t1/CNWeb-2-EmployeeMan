import { Component, OnInit, OnDestroy } from '@angular/core';
import { AttendanceService } from '../../core/services/attendance.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Attendance } from '../../core/models/attendance.model';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  worked: boolean;
  reached: boolean;
}

interface CalendarMonth {
  month: number;
  year: number;
  days: CalendarDay[];
  workDays: number;
}

@Component({
  selector: 'app-chamcong',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chamcong.component.html',
  styleUrls: ['./chamcong.component.css'],
})
export class ChamcongComponent implements OnInit, OnDestroy {
  employee: any;
  attendances: Attendance[] = [];
  calendars: CalendarMonth[] = [];
  checkInTime: string = ''; // hiển thị ở HTML

  checkedInToday = false;
  checkedOutToday = false;

  currentTime: Date = new Date();
  private timerSubscription: any;

  constructor(
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    const today = this.formatDate(new Date());
    const savedTime = localStorage.getItem('checkInTime_' + today);
    if (savedTime) {
      this.checkInTime = savedTime;
    }

    this.employeeService.getCurrentEmployee().subscribe((emp) => {
      this.employee = emp;
      this.attendanceService
        .getAttendanceByEmployeeId(emp.employeeId)
        .subscribe((data) => {
          this.attendances = data;
          this.autoClearOldCheckIn();
          this.updateTodayStatus();
          this.generateCalendars();
        });
    });

    // BỔ SUNG: Cập nhật đồng hồ mỗi giây
    this.timerSubscription = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      clearInterval(this.timerSubscription);
    }
  }

  updateTodayStatus(): void {
    const today = this.formatDate(new Date());
    const todayAttendance = this.attendances.find((a) => a.date === today);
    this.checkedInToday = !!todayAttendance;
    this.checkedOutToday = !!todayAttendance?.checkOut;
  }

  autoClearOldCheckIn(): void {
    // Duyệt toàn bộ các key lưu check-in
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('checkInTime_')) {
        const dateStr = key.replace('checkInTime_', '');
        const checkInDate = new Date(dateStr);
        const today = new Date();

        // Nếu ngày trong key cũ hơn hôm nay và chưa checkOut (không tồn tại attendance)
        const exists = this.attendances.some((a) => a.date === dateStr);
        if (!exists && checkInDate < today) {
          localStorage.removeItem(key); // ✅ Xóa check-in cũ
          if (this.formatDate(today) === dateStr) {
            this.checkInTime = '';
            this.checkedInToday = false;
          }
        }
      }
    }
  }

  checkIn(): void {
    if (!this.employee) return;

    const today = this.formatDate(new Date());

    // Nếu đã có attendance hôm nay, tức là đã check-out => không cho check-in nữa
    const existing = this.attendances.find((a) => a.date === today);
    if (existing) {
      alert('Bạn đã hoàn thành chấm công hôm nay.');
      return;
    }

    // Nếu đã có check-in trong localStorage thì không cho check-in lại
    if (localStorage.getItem('checkInTime_' + today)) {
      alert('Bạn đã check-in hôm nay!');
      return;
    }

    const now = new Date();
    this.checkInTime = now.toTimeString().slice(0, 8);
    localStorage.setItem('checkInTime_' + today, this.checkInTime);
    this.checkedInToday = true;

    alert(`Đã lưu thời gian check-in: ${this.checkInTime}`);
  }

  checkOut(): void {
    const today = this.formatDate(new Date());
    const checkInTime = localStorage.getItem('checkInTime_' + today);
    if (!checkInTime) {
      alert('Bạn chưa check-in hôm nay!');
      return;
    }

    const now = new Date();
    const checkOutTime = now.toTimeString().slice(0, 8);

    const newAttendance: Attendance = {
      attendanceId: 0,
      employeeId: this.employee.employeeId,
      date: today,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      recordedByUserId: 0,
    };

    this.attendanceService.addAttendance(newAttendance).subscribe(
      () => {
        this.attendances.push(newAttendance);
        this.checkedInToday = true;
        this.checkedOutToday = true;
        this.checkInTime = '';
        localStorage.removeItem('checkInTime_' + today);
        alert('Chấm công thành công!');
        this.refreshCalendar();
      },
      (error) => {
        console.error('Lỗi khi gửi dữ liệu chấm công:', error);
        alert(
          'Check-out thất bại. Lỗi: ' +
            (error?.error?.message || JSON.stringify(error.error))
        );
      }
    );
  }

  refreshCalendar(): void {
    this.calendars = [];
    this.generateCalendars();
    this.updateTodayStatus();
  }

  generateCalendars(): void {
    if (!this.employee) return;

    const hireDate = new Date(this.employee.hireDate);
    const today = new Date();
    let current = new Date(hireDate.getFullYear(), hireDate.getMonth(), 1);

    while (current <= today) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days: CalendarDay[] = [];
      let workDaysCount = 0;

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const dateStr = this.formatDate(dateObj);
        const attendance = this.attendances.find((a) => a.date === dateStr);
        let worked = false;
        let reached = false;

        if (attendance && attendance.checkIn && attendance.checkOut) {
          worked = true;
          const [inHour, inMin] = attendance.checkIn.split(':').map(Number);
          const [outHour, outMin] = attendance.checkOut.split(':').map(Number);
          const duration = outHour * 60 + outMin - (inHour * 60 + inMin);
          if (duration >= 480) reached = true;
          if (reached) workDaysCount++;
        }

        days.push({ date: dateObj, worked, reached });
      }

      this.calendars.push({
        month: month + 1,
        year,
        days,
        workDays: workDaysCount,
      });

      current.setMonth(current.getMonth() + 1);
    }
  }

  getWeeks(days: CalendarDay[]): (CalendarDay | null)[][] {
    const weeks: (CalendarDay | null)[][] = [];
    let week: (CalendarDay | null)[] = [];
    const firstDayOfWeek = days[0].date.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) week.push(null);
    for (let day of days) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    return weeks;
  }

  getDayClasses(day: CalendarDay): string {
    if (!day) return '';
    if (day.worked) return day.reached ? 'reached' : 'worked';
    return '';
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
