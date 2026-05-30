import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { CreateReleaseData, Release } from '../models/release.model';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  constructor(private supabase: SupabaseService) {}

  async getUserReleases(): Promise<Release[]> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return [];

    const { data, error } = await this.supabase.client
      .from('releases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('ReleaseService.getUserReleases', error);
      return [];
    }
    return (data as Release[]) ?? [];
  }

  async getArtistReleases(artistId: string): Promise<Release[]> {
    const { data, error } = await this.supabase.client
      .from('releases')
      .select('*')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('ReleaseService.getArtistReleases', error);
      return [];
    }
    return (data as Release[]) ?? [];
  }

  async createRelease(
    payload: CreateReleaseData,
    artistId?: string
  ): Promise<{ data: Release | null; error: Error | null }> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      return { data: null, error: new Error('No hay sesión activa') };
    }

    const insertData: Record<string, unknown> = {
      ...payload,
      user_id: userId,
    };
    if (artistId) {
      insertData['artist_id'] = artistId;
    }

    const { data, error } = await this.supabase.client
      .from('releases')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { data: null, error: error as unknown as Error };
    }
    return { data: data as Release, error: null };
  }

  async getReleaseById(id: string): Promise<Release | null> {
    const { data, error } = await this.supabase.client
      .from('releases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('ReleaseService.getReleaseById', error);
      return null;
    }
    return data as Release;
  }

  async updateRelease(
    id: string,
    payload: Partial<CreateReleaseData>
  ): Promise<{ error: Error | null }> {
    const { error } = await this.supabase.client
      .from('releases')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { error: error as unknown as Error };
    }
    return { error: null };
  }

  async deleteRelease(id: string): Promise<{ error: Error | null }> {
    const { error } = await this.supabase.client
      .from('releases')
      .delete()
      .eq('id', id);

    if (error) {
      return { error: error as unknown as Error };
    }
    return { error: null };
  }
}
