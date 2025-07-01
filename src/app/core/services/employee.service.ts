import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'https://localhost:5001/api/Employees';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllEmployees(): Observable<Employee[]> {
    const employees$ = this.http.get<Employee[]>(this.apiUrl);
    employees$.subscribe(data => console.log('employees: ', data)); // Đây mới là mảng
    return employees$;
  }

  /**
   * @deprecated This method is deprecated. Use getEmployeeByUserId or getEmployeeByUsername instead.
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  getEmployeeByUserId(userId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/ByUserId/${userId}`);
  }

  getEmployeeByUsername(username: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/ByUsername/${username}`);
  } 


  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, emp);
  }

  updateEmployee(id: number, emp: Employee): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, emp);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getCurrentEmployee(): Observable<Employee> {
  const user = this.authService.getUser();
  if (!user) throw new Error('Chưa đăng nhập');

  return this.getEmployeeByUserId(user.userId);
}

}
