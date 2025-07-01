import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Salary } from '../models/salary.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalaryService {
  private apiUrl = 'https://localhost:5001/api/Salaries';

  constructor(private http: HttpClient) {}

  getLatestSalary(empId: number): Observable<Salary> {
    return this.http.get<Salary>(`${this.apiUrl}/Latest/${empId}`);
  }

  getSalariesByEmployee(empId: number): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${this.apiUrl}/Employee/${empId}`);
  }
  
  getAllSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.apiUrl);
  }

  getSalariesByMonthYear(month: number, year: number): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${this.apiUrl}/Filter?month=${month}&year=${year}`);
  }

  addSalary(salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(`${this.apiUrl}`, salary);
  }

}
