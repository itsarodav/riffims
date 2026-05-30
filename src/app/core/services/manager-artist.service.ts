import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ArtistRole, ManagerArtist } from '../models/profile.model';

export interface CreateArtistData {
  name: string;
  emoji: string | null;
  role: ArtistRole | null;
  genres: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ManagerArtistService {
  constructor(private supabase: SupabaseService) {}

  async getArtists(): Promise<ManagerArtist[]> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return [];

    const { data, error } = await this.supabase.client
      .from('manager_artists')
      .select('*')
      .eq('manager_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('ManagerArtistService.getArtists', error);
      return [];
    }
    return (data as ManagerArtist[]) ?? [];
  }

  async getArtistById(id: string): Promise<ManagerArtist | null> {
    const { data, error } = await this.supabase.client
      .from('manager_artists')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('ManagerArtistService.getArtistById', error);
      return null;
    }
    return data as ManagerArtist;
  }

  async createArtist(
    payload: CreateArtistData
  ): Promise<{ data: ManagerArtist | null; error: Error | null }> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      return { data: null, error: new Error('No hay sesión activa') };
    }

    const { data, error } = await this.supabase.client
      .from('manager_artists')
      .insert({ ...payload, manager_id: userId })
      .select()
      .single();

    if (error) {
      return { data: null, error: error as unknown as Error };
    }
    return { data: data as ManagerArtist, error: null };
  }

  async updateArtist(
    id: string,
    payload: Partial<CreateArtistData>
  ): Promise<{ error: Error | null }> {
    const { error } = await this.supabase.client
      .from('manager_artists')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { error: error as unknown as Error };
    }
    return { error: null };
  }

  async deleteArtist(id: string): Promise<{ error: Error | null }> {
    const { error } = await this.supabase.client
      .from('manager_artists')
      .delete()
      .eq('id', id);

    if (error) {
      return { error: error as unknown as Error };
    }
    return { error: null };
  }
}
