import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    // Inyecta el SupabaseService para usar la conexión que ya tiene abierta y el Router para poder redirigir al usuario tras login/logout
  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  // Inicia sesión con email y contraseña .Devuelve el error si algo falla, para que el componente pueda mostrarlo
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.signIn(email, password);
    return { data, error };
  }

  // registra nuevo usuario
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.signUp(email, password);
    return { data, error };
  }

  // Cierra sesión y redirige al login
  async signOut() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }

  // Devuelve el usuario activo en este momento para mostrar el nombre del usuario en la app
  async getCurrentUser() {
    const { data } = await this.supabase.getSession();
    return data.session?.user ?? null;
  }
}
