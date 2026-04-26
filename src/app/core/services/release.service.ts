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

  async createRelease(
    payload: CreateReleaseData
  ): Promise<{ data: Release | null; error: Error | null }> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      return { data: null, error: new Error('No hay sesión activa') };
    }

    const { data, error } = await this.supabase.client
      .from('releases')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();

    if (error) {
      return { data: null, error: error as unknown as Error };
    }
    return { data: data as Release, error: null };
  }
}
