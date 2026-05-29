export type ProfileType = 'solo' | 'banda' | 'manager';

export interface ProfileTypeOption {
  value: ProfileType;
  label: string;
  emoji: string;
  comingSoon: boolean;
}

export const PROFILE_TYPES: ProfileTypeOption[] = [
  { value: 'solo',    label: 'Flying Solo', emoji: '🚀', comingSoon: false },
  { value: 'banda',   label: 'Banda',       emoji: '🎸', comingSoon: true },
  { value: 'manager', label: 'Manager',     emoji: '💼', comingSoon: true },
];
