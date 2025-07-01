import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leave } from '../models/leave.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private apiUrl = 'https://localhost:5001/api/Leaves';

  constructor(private http: HttpClient) {}

  getPendingLeaves(empId: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/Pending/${empId}`);
  }

  getAllLeavesByEmployee(empId: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/Employee/${empId}`);
  }

  createLeave(data: Partial<Leave>): Observable<Leave> {
    return this.http.post<Leave>(this.apiUrl, data);
  }

  // ✅ Lấy tất cả đơn nghỉ phép (dành cho Admin hoặc HR)
  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.apiUrl);
  }
updateLeaveStatus(id: number, status: string) {
  return this.http.put(`${this.apiUrl}/UpdateStatus/${id}?status=${status}`, {});
}

}
