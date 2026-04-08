import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

// Impide el acceso a rutas privadas cuando no hay sesión activa.
// Si no hay sesión, redirige al login.
export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const { data } = await supabase.getSession();
  if (data.session) return true;

  return router.createUrlTree(['/login']);
};
