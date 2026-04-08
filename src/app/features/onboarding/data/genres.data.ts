// Lista curada de géneros musicales disponibles en el onboarding.
// Se mantiene como constante estática para no meter otra tabla en Supabase
// mientras las necesidades del producto no lo justifiquen.

export const MUSIC_GENRES: string[] = [
  'Rock',
  'Pop',
  'Indie',
  'Hip Hop',
  'R&B',
  'Soul',
  'Jazz',
  'Blues',
  'Funk',
  'Electrónica',
  'House',
  'Techno',
  'Reggaetón',
  'Trap',
  'Reggae',
  'Punk',
  'Metal',
  'Folk',
  'Country',
  'Clásica',
  'Latina',
  'Flamenco',
];

export const MIN_GENRES = 1;
export const MAX_GENRES = 5;
