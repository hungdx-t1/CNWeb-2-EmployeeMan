import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeProfileService {
  private baseUrl = 'https://localhost:5001/api/employee/my-profile';

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<Employee> {
    return this.http.get<Employee>(this.baseUrl);
  }
}
