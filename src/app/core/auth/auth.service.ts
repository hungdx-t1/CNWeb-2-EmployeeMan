import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:5001/api/Auth'; // backend endpoint
  private loggedIn = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { username, password });
  }

  setSession(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData));
    this.loggedIn = true;
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (this.loggedIn) return true;

    const user = localStorage.getItem('user');
    if (user) {
      this.loggedIn = true;
      return true;
    }

    return false;
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }


}