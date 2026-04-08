// Tipo que refleja 1:1 la tabla public.profiles de Supabase

export type ArtistRole = 'musician' | 'singer' | 'band';

export interface Profile {
  id: string;
  username: string | null;
  artist_name: string | null;
  role: ArtistRole | null;
  genres: string[];
  emoji: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Datos que el usuario produce durante el onboarding.
// No incluye id, timestamps ni el flag, que se resuelven en el servicio.
export interface OnboardingData {
  username: string;
  artist_name: string;
  role: ArtistRole;
  genres: string[];
  emoji: string;
}
