import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { Button } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import {
  ChipGroupComponent,
  ChipOption,
} from '../../shared/components/chip-group/chip-group.component';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { ArtistRole } from '../../core/models/profile.model';
import { MUSIC_GENRES, MAX_GENRES, MIN_GENRES } from '../onboarding/data/genres.data';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, AvatarComponent, Button, InputComponent, ChipGroupComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);

  protected avatarUrl = signal<string | null>(null);
  protected artistName = signal('');
  protected selectedRole = signal<ArtistRole[]>([]);
  protected selectedGenres = signal<string[]>([]);

  protected uploading = signal(false);
  protected saving = signal(false);
  protected saveMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  protected readonly roleOptions: ChipOption<ArtistRole>[] = [
    { value: 'musician', label: 'Músico', emoji: '🎸' },
    { value: 'singer', label: 'Cantante', emoji: '🎤' },
    { value: 'band', label: 'Banda', emoji: '🎵' },
  ];

  protected readonly genreOptions: ChipOption<string>[] = MUSIC_GENRES.map(g => ({
    value: g,
    label: g,
  }));

  protected readonly maxGenres = MAX_GENRES;
  protected readonly minGenres = MIN_GENRES;

  async ngOnInit() {
    const p = await this.profileService.loadProfile();
    if (p) {
      this.avatarUrl.set(p.avatar_url);
      this.artistName.set(p.artist_name ?? '');
      if (p.role) this.selectedRole.set([p.role]);
      if (p.genres?.length) this.selectedGenres.set(p.genres);
    }
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Preview local inmediato
    const reader = new FileReader();
    reader.onload = () => this.avatarUrl.set(reader.result as string);
    reader.readAsDataURL(file);

    // Subida a Supabase
    this.uploadAvatar(file);

    // Reset para permitir re-seleccionar el mismo archivo
    input.value = '';
  }

  private async uploadAvatar(file: File) {
    this.uploading.set(true);
    const url = await this.profileService.uploadAvatar(file);
    if (url) {
      const { error } = await this.profileService.updateAvatarUrl(url);
      if (error) {
        console.error('PerfilComponent.uploadAvatar', error);
      } else {
        this.avatarUrl.set(url);
      }
    }
    this.uploading.set(false);
  }

  protected onArtistNameChange(value: string) {
    this.artistName.set(value);
  }

  protected onRoleChange(selected: ArtistRole[]) {
    this.selectedRole.set(selected);
  }

  protected onGenresChange(selected: string[]) {
    this.selectedGenres.set(selected);
  }

  protected async saveProfile() {
    this.saving.set(true);
    this.saveMessage.set(null);

    const { error } = await this.profileService.updateProfile({
      artist_name: this.artistName().trim(),
      role: this.selectedRole()[0] ?? undefined,
      genres: this.selectedGenres(),
    });

    if (error) {
      console.error('PerfilComponent.saveProfile', error);
      this.saveMessage.set({ type: 'error', text: 'Error al guardar los cambios.' });
    } else {
      this.saveMessage.set({ type: 'success', text: 'Cambios guardados.' });
    }

    this.saving.set(false);
  }

  protected async signOut() {
    await this.authService.signOut();
  }
}
