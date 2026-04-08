import { ArtistRole } from '../../../core/models/profile.model';

export interface RoleOption {
  value: ArtistRole;
  label: string;
  emoji: string;
}

export const ARTIST_ROLES: RoleOption[] = [
  { value: 'musician', label: 'Músico', emoji: '🎸' },
  { value: 'singer', label: 'Cantante', emoji: '🎤' },
  { value: 'band', label: 'Banda', emoji: '🥁' },
];
