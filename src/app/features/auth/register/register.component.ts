import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Button } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email = '';
  password = '';
  acceptedTerms = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onRegister() {
    if (!this.acceptedTerms) {
      this.errorMessage = 'Debes aceptar los términos de uso para continuar';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { error } = await this.authService.signUp(this.email, this.password);

    if (error) {
      this.errorMessage = 'No se pudo crear la cuenta. Inténtalo de nuevo.';
      this.isLoading = false;
      return;
    }

    this.router.navigate(['/onboarding']);
    this.isLoading = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
