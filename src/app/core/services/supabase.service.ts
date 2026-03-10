import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Crea una cuenta nueva con email y contraseña
  signUp(email: string, password: string) {
    return this.client.auth.signUp({ email, password });
  }

  // Para iniciar sesión con una cuenta ya existente
  signIn(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

    // Cierra la sesión del usuario actual
  signOut() {
    return this.client.auth.signOut();
  }

  // Comprobar sesión activa de user loguerado. Lo usa el auth guard para decidir si dejar pasar o redirigir al login :)
  getSession() {
    return this.client.auth.getSession();
  }
}

