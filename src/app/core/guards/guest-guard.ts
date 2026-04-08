import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { ProfileService } from '../services/profile.service';

// Aplicada a las rutas públicas (login, register). Si ya hay sesión
// activa, redirige al home o al onboarding según corresponda, para
// evitar que una persona autenticada vuelva al formulario de acceso.
export const guestGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const profileService = inject(ProfileService);
  const router = inject(Router);

  const { data } = await supabase.getSession();
  if (!data.session) return true;

  const completed = await profileService.isOnboardingCompleted();
  return router.createUrlTree([completed ? '/home' : '/onboarding']);
};
