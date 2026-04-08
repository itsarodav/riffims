import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Button } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  async onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    const { error } = await this.authService.signIn(this.email, this.password);

    if (error) {
      this.errorMessage = 'Email o contraseña incorrectos';
      this.isLoading = false;
      return;
    }

    // Redirigir según el estado del onboarding
    const completed = await this.profileService.isOnboardingCompleted();
    this.router.navigate([completed ? '/home' : '/onboarding']);
    this.isLoading = false;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
