// Tipo que refleja 1:1 la tabla public.profiles de Supabase

export type ArtistRole = 'musician' | 'singer' | 'band';
export type ProfileType = 'solo' | 'banda' | 'manager';

export interface Profile {
  id: string;
  username: string | null;
  artist_name: string | null;
  role: ArtistRole | null;
  genres: string[];
  emoji: string | null;
  avatar_url: string | null;
  profile_type: ProfileType;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Datos que el usuario produce durante el onboarding (artista solo).
// No incluye id, timestamps ni el flag, que se resuelven en el servicio.
export interface OnboardingData {
  username: string;
  artist_name: string;
  role: ArtistRole;
  genres: string[];
  emoji: string;
}

// Datos del onboarding para managers (flujo corto).
export interface ManagerOnboardingData {
  username: string;
  artist_name: string; // display name del manager
}

// Artista gestionado por un manager
export interface ManagerArtist {
  id: string;
  manager_id: string;
  name: string;
  emoji: string | null;
  role: ArtistRole | null;
  genres: string[];
  created_at: string;
  updated_at: string;
}
