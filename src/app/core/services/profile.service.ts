import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { OnboardingData, Profile } from '../models/profile.model';

// Aísla el acceso a la tabla public.profiles. Ningún componente toca
// directamente el cliente de Supabase para trabajar con perfiles: todo
// pasa por aquí.
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private supabase: SupabaseService) {}

  // Devuelve la fila de profiles del usuario autenticado, o null si
  // no hay sesión o no existe aún la fila.
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
  // excluyendo al propio usuario autenticado, de modo que reabrir el
  // paso con el mismo nombre no dé un falso positivo de ocupado.
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

  // Guarda los datos recogidos durante el onboarding y marca la fila
  // como completada. Devuelve { error } para que el componente pueda
  // mostrar un mensaje si algo falla.
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
        onboarding_completed: true,
      })
      .eq('id', userId);

    return { error };
  }
}
