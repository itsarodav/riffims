import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // Valores que se enlazan con los inputs del formulario
  email = '';
  password = '';

  // Mensaje de error que se muestra si algo falla
  errorMessage = '';

  // Controla si el botón está desactivado mientras carga
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    const { error } = await this.authService.signIn(this.email, this.password);

    if (error) {
      // Si hay error, lo mostramos al usuario
      this.errorMessage = 'Email o contraseña incorrectos';
    } else {
      // Si va bien, redirigimos a home
      this.router.navigate(['/home']);
    }

    this.isLoading = false;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
