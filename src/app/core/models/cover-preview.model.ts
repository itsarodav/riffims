// Tipo que refleja 1to1 la tabla public.cover_previews de Supabase

export interface CoverPreview {
  id: string;
  user_id: string;
  image_url: string;
  position: number; // 0-3
  created_at: string;
  updated_at: string;
}
