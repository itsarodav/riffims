import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

// Protege las vistas privadas exigiendo que el onboarding se haya
// completado. Si el flag es falso, redirige al onboarding.
// Se encadena después de authGuard, así que aquí asumimos sesión.
export const onboardingGuard: CanActivateFn = async () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  const completed = await profileService.isOnboardingCompleted();
  if (completed) return true;

  return router.createUrlTree(['/onboarding']);
};

// Guarda complementaria: protege la propia ruta de onboarding. Si el
// flag ya está en true, la persona usuaria no debería poder volver a
// verlo, así que la enviamos al home.
export const onboardingPendingGuard: CanActivateFn = async () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  const completed = await profileService.isOnboardingCompleted();
  if (!completed) return true;

  return router.createUrlTree(['/home']);
};
