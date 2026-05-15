import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { CoverPreview } from '../models/cover-preview.model';

// Aísla el acceso a la tabla public.cover_previews y al bucket cover-previews de Storage. Ningún componente toca directamente el cliente de Supabase para trabajar con portadas., todo pasa por aquí.

@Injectable({
  providedIn: 'root',
})
export class CoverPreviewService {
  constructor(private supabase: SupabaseService) {}

  // devuelve las portadas del usuario autenticado, ordenadas por position.
  async getUserCovers(): Promise<CoverPreview[]> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return [];

    const { data, error } = await this.supabase.client
      .from('cover_previews')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) {
      console.error('CoverPreviewService.getUserCovers', error);
      return [];
    }
    return (data as CoverPreview[]) ?? [];
  }

  // Sube una imagen al bucket y crea oactualiza la fila en la tabla.
  // Devuelve el CoverPreview con la URL pública o null si falla.
  async uploadCover(
    file: File,
    position: number
  ): Promise<CoverPreview | null> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return null;

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/cover-${position}.${ext}`;

    const { error: uploadError } = await this.supabase.client.storage
      .from('cover-previews')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error('CoverPreviewService.uploadCover (storage)', uploadError);
      return null;
    }

    const { data: urlData } = this.supabase.client.storage
      .from('cover-previews')
      .getPublicUrl(path);

    const imageUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { data, error: dbError } = await this.supabase.client
      .from('cover_previews')
      .upsert(
        { user_id: userId, image_url: imageUrl, position },
        { onConflict: 'user_id,position' }
      )
      .select()
      .single();

    if (dbError) {
      console.error('CoverPreviewService.uploadCover (db)', dbError);
      return null;
    }
    return data as CoverPreview;
  }

  // Elimina la imagen del bucket y la fila de la tabla.
  async deleteCover(
    coverId: string,
    position: number
  ): Promise<{ error: Error | null }> {
    const { data: sessionData } = await this.supabase.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return { error: new Error('No hay sesión activa') };

    // Eliminar todos los posibles archivos con distintas extensiones
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const paths = extensions.map((e) => `${userId}/cover-${position}.${e}`);

    await this.supabase.client.storage.from('cover-previews').remove(paths);

    const { error } = await this.supabase.client
      .from('cover_previews')
      .delete()
      .eq('id', coverId);

    if (error) {
      console.error('CoverPreviewService.deleteCover', error);
      return { error };
    }
    return { error: null };
  }
}
