import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { OnboardingComponent } from './features/onboarding/onboarding.component';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { HomeComponent } from './features/home/home.component';
import { LanzamientosComponent } from './features/lanzamientos/lanzamientos.component';
import { RiffiComponent } from './features/riffi/riffi.component';
import { PerfilComponent } from './features/perfil/perfil.component';
import { NuevoLanzamientoComponent } from './features/nuevo-lanzamiento/nuevo-lanzamiento.component';
import { CoverPreviewComponent } from './features/cover-preview/cover-preview.component';
import { LogrosComponent } from './features/logros/logros.component';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import {
  onboardingGuard,
  onboardingPendingGuard,
} from './core/guards/onboarding-guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
      {
        path: 'onboarding',
        component: OnboardingComponent,
        canActivate: [authGuard, onboardingPendingGuard],
      },
    ],
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard, onboardingGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'lanzamientos', component: LanzamientosComponent },
      { path: 'riffi', component: RiffiComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'nuevo', component: NuevoLanzamientoComponent },
      { path: 'cover-preview', component: CoverPreviewComponent },
      { path: 'logros', component: LogrosComponent },
      {
        path: 'releases/:releaseId/path',
        loadComponent: () => import('./features/releases/release-path/release-path.component')
          .then(m => m.ReleasePathComponent),
        data: { pageTitle: 'Ruta de lanzamiento' },
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
