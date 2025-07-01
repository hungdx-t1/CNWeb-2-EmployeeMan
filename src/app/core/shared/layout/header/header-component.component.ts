import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.css'
})
export class HeaderComponentComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
  }
}
