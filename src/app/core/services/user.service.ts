import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:5001/api/Users';

  constructor(private http: HttpClient) {}

  getall():Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}`);
  }
  
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> { 
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateUserRole(userId: number, role: string): Observable<any> {
  return this.http.put(`https://localhost:5001/api/Users/${userId}/role`, JSON.stringify(role), {
    headers: { 'Content-Type': 'application/json' }
  });
  }

}


