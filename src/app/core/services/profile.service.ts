import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
  ArtistRole,
  ManagerOnboardingData,
  OnboardingData,
  Profile,
} from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly _profile = signal<Profile | null>(null);
  readonly profile = this._profile.asReadonly();

  constructor(private supabase: SupabaseService) {}

  async loadProfile(): Promise<Profile | null> {
    const p = await this.getCurrentProfile();
    this._profile.set(p);
    return p;
  }

  async getCurrentProfile(): Promise<Profile | null> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return null;

    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('ProfileService.getCurrentProfile', error);
      return null;
    }
    return (data as Profile) ?? null;
  }

  // Devuelve true si el onboarding ya se completó.
  async isOnboardingCompleted(): Promise<boolean> {
    const profile = await this.getCurrentProfile();
    return profile?.onboarding_completed ?? false;
  }

  // Comprueba si un username está disponible, ignorando mayúsculas y
  // excluyendo al propio usuario autenticado, de modo que reabrir el paso con el mismo nombre no dé un falso positivo de ocupado.
  async isUsernameAvailable(username: string): Promise<boolean> {
    const normalized = username.trim().toLowerCase();
    if (!normalized) return false;

    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;

    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('id')
      .ilike('username', normalized)
      .limit(1);

    if (error) {
      console.error('ProfileService.isUsernameAvailable', error);
      return false;
    }
    if (!data || data.length === 0) return true;
    return data[0].id === userId;
  }

  // Guarda los datos recogidos durante el onboarding y marca la fila como completada. Devuelve { error } para que el componente pueda mostrar un mensaje si algo falla.
  async completeOnboarding(payload: OnboardingData) {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      return { error: new Error('No hay sesión activa') };
    }

    const { error } = await this.supabase.client
      .from('profiles')
      .update({
        username: payload.username.trim(),
        artist_name: payload.artist_name.trim(),
        role: payload.role,
        genres: payload.genres,
        emoji: payload.emoji,
        profile_type: 'solo',
        onboarding_completed: true,
      })
      .eq('id', userId);

    return { error };
  }

  // Onboarding corto para managers: solo username y display name.
  async completeManagerOnboarding(payload: ManagerOnboardingData) {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      return { error: new Error('No hay sesión activa') };
    }

    const { error } = await this.supabase.client
      .from('profiles')
      .update({
        username: payload.username.trim(),
        artist_name: payload.artist_name.trim(),
        profile_type: 'manager',
        onboarding_completed: true,
      })
      .eq('id', userId);

    if (!error) {
      await this.loadProfile();
    }

    return { error };
  }

  // Sube una imagen de avatar a Supabase Storage, sobreescribiendo
  // si ya existía. Retorna la URL pública o null si falla.
  async uploadAvatar(file: File): Promise<string | null> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return null;

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/avatar.${ext}`;

    const { error } = await this.supabase.client.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (error) {
      console.error('ProfileService.uploadAvatar', error);
      return null;
    }

    const { data: urlData } = this.supabase.client.storage
      .from('avatars')
      .getPublicUrl(path);
    return `${urlData.publicUrl}?t=${Date.now()}`;
  }

  async updateAvatarUrl(avatarUrl: string) {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return { error: new Error('No hay sesión activa') };

    const { error } = await this.supabase.client
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    if (!error) {
      const current = this._profile();
      if (current) {
        this._profile.set({ ...current, avatar_url: avatarUrl });
      } else {
        await this.loadProfile();
      }
    }

    return { error };
  }

  async updateProfile(data: {
    artist_name?: string;
    role?: ArtistRole;
    genres?: string[];
  }) {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return { error: new Error('No hay sesión activa') };

    const { error } = await this.supabase.client
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (!error) {
      const current = this._profile();
      if (current) {
        this._profile.set({ ...current, ...data });
      } else {
        await this.loadProfile();
      }
    }

    return { error };
  }
}
