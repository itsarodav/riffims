import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { OnboardingComponent } from './features/onboarding/onboarding.component';
import { Home } from './features/home/home';
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
    path: 'home',
    component: Home,
    canActivate: [authGuard, onboardingGuard],
  },
  { path: '**', redirectTo: '' },
];
