import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  // si el checkbox de términos está marcado
  acceptedTerms = false;

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onRegister() {
    // Validación required no dejar registrarse sin aceptar términos
    if (!this.acceptedTerms) {
      this.errorMessage = 'Debes aceptar los términos de uso para continuar';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { error } = await this.authService.signUp(this.email, this.password);

    if (error) {
      this.errorMessage = 'No se pudo crear la cuenta. Inténtalo de nuevo.';
    } else {
      // Registro exitoso → redirigir al login
      this.router.navigate(['/login']);
    }

    this.isLoading = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
