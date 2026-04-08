import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ArtistRole, OnboardingData } from '../../core/models/profile.model';
import { StepWelcomeComponent } from './steps/step-welcome/step-welcome.component';
import {
  StepBasicsComponent,
  StepBasicsData,
} from './steps/step-basics/step-basics.component';
import { StepRoleComponent } from './steps/step-role/step-role.component';
import { StepGenresComponent } from './steps/step-genres/step-genres.component';
import { StepEmojiComponent } from './steps/step-emoji/step-emoji.component';

type DraftData = Partial<OnboardingData>;

// Contenedor del recorrido de onboarding. Mantiene el paso actual, los
// datos recogidos y orquesta la navegación entre pasos. Al finalizar
// llama a ProfileService.completeOnboarding y redirige al home.
@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    StepWelcomeComponent,
    StepBasicsComponent,
    StepRoleComponent,
    StepGenresComponent,
    StepEmojiComponent,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements OnInit {
  readonly totalSteps = 5;
  currentStep = 1;

  draft: DraftData = {
    username: '',
    artist_name: '',
    role: undefined,
    genres: [],
    emoji: undefined,
  };

  submitting = false;
  errorMessage = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  async onSignOut() {
    await this.authService.signOut();
  }

  async ngOnInit() {
    // Precarga lo que ya exista en el perfil por si se retoma un
    // onboarding interrumpido.
    const profile = await this.profileService.getCurrentProfile();
    if (profile) {
      this.draft = {
        username: profile.username ?? '',
        artist_name: profile.artist_name ?? '',
        role: profile.role ?? undefined,
        genres: profile.genres ?? [],
        emoji: profile.emoji ?? undefined,
      };
    }
  }

  goNext() {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  goBack() {
    if (this.currentStep > 1) this.currentStep--;
  }

  onBasicsNext(data: StepBasicsData) {
    this.draft.artist_name = data.artist_name;
    this.draft.username = data.username;
    this.goNext();
  }

  onRoleNext(role: ArtistRole) {
    this.draft.role = role;
    this.goNext();
  }

  onGenresNext(genres: string[]) {
    this.draft.genres = genres;
    this.goNext();
  }

  async onEmojiFinish(emoji: string) {
    this.draft.emoji = emoji;
    this.errorMessage = '';

    if (
      !this.draft.username ||
      !this.draft.artist_name ||
      !this.draft.role ||
      !this.draft.genres ||
      this.draft.genres.length === 0
    ) {
      this.errorMessage = 'Faltan datos por completar en pasos anteriores.';
      return;
    }

    this.submitting = true;
    try {
      const { error } = await this.profileService.completeOnboarding({
        username: this.draft.username,
        artist_name: this.draft.artist_name,
        role: this.draft.role,
        genres: this.draft.genres,
        emoji,
      });

      if (error) {
        console.error('completeOnboarding error', error);
        this.errorMessage =
          'No hemos podido guardar tu perfil. Inténtalo de nuevo.';
        return;
      }

      await this.router.navigate(['/home']);
    } catch (e) {
      console.error('completeOnboarding threw', e);
      this.errorMessage =
        'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
    } finally {
      this.submitting = false;
    }
  }
}
