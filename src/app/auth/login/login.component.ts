import { Component } from '@angular/core';
import { UserLoginRequest } from '../../core/models/user-login.model';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: UserLoginRequest = { username: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
  this.authService.login(this.loginData.username, this.loginData.password).subscribe({
      next: (res: any) => {
        this.authService.setSession(res);

        // Điều hướng theo vai trò
        const role = res.role?.toLowerCase();
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'employee') {
          this.router.navigate(['/employee']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
        console.error(err);
      }
    });
  }

}
