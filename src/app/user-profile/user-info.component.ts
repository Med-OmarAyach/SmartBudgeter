import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: User | null = null;
  loading = true;
  errorMessage = '';

  constructor(private userService: UserService,private router: Router, private authService: AuthService,) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Unable to load user info.';
        this.loading = false;
      }
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Navigate to edit user page
  editUser(): void {
    if (this.user?.id) {
      this.router.navigate(['/edit-user', this.user.id]);
    }
  }
}
