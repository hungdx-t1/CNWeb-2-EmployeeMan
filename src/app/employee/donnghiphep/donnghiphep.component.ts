import { Component, OnInit } from '@angular/core';
import { Leave } from '../../core/models/leave.model';
import { LeaveService } from '../../core/services/leave.service';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donnghiphep',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donnghiphep.component.html',
  styleUrls: ['./donnghiphep.component.css']
})
export class DonnghiphepComponent implements OnInit {
  leaves: Leave[] = [];

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    const employeeId = user?.employeeId;

    if (employeeId) {
      this.leaveService.getAllLeavesByEmployee(employeeId).subscribe({
        next: (data) => this.leaves = data,
        error: () => {}
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approved': return 'green';
      case 'Pending': return 'orange';
      case 'Rejected': return 'red';
      default: return 'gray';
    }
  }

  goToCreateLeave(): void {
    this.router.navigate(['/main/guidonnghiphep']);
  }

  selectedLeaveId: number | null = null;

  toggleDetails(leaveId: number): void {
    this.selectedLeaveId = this.selectedLeaveId === leaveId ? null : leaveId;
  }

}
