export type MissionPhase = 'produccion' | 'release' | 'post-release';
export type InteractionType = 'tareas' | 'aprende' | 'checklist' | 'riffi' | 'crea';
export type BadgeId = 'started' | 'studio' | 'platforms' | 'data';

export interface Mission {
  level: number;
  title: string;
  subtitle: string;
  phase: MissionPhase;
  interactionTypes: InteractionType[];
  badgeLabel: string;
  subtasks: string[];
  badgeOnComplete?: BadgeId;
}

export interface PhaseInfo {
  phase: MissionPhase;
  label: string;
  levels: string;
  description: string;
  badgeId: BadgeId;
  afterLevel: number;
  icon: string;
}

export interface StarterBadge {
  label: string;
  description: string;
  badgeId: BadgeId;
  icon: string;
}

export const STARTER_BADGE: StarterBadge = {
  label: '¡Soundcheck!',
  description: 'Completaste tu primera misión. El primer paso es siempre el más difícil y ya lo tienes.',
  badgeId: 'started',
  icon: 'first-badge',
};

export const PHASE_INFO: PhaseInfo[] = [
  {
    phase: 'produccion',
    label: 'Pre y Producción',
    levels: 'Niveles 1–3',
    description: 'Estudio y branding completo. Todo grabado, mezclado y masterizado.',
    badgeId: 'studio',
    afterLevel: 3,
    icon: 'second-badge',
  },
  {
    phase: 'release',
    label: 'Release',
    levels: 'Niveles 4–8',
    description: 'En las plataformas. Distribuida y con campaña activa.',
    badgeId: 'platforms',
    afterLevel: 8,
    icon: 'third-badge',
  },
  {
    phase: 'post-release',
    label: 'Post Release',
    levels: 'Niveles 9–10',
    description: '¡Autogestionándote! Impulso mantenido y métricas leídas.',
    badgeId: 'data',
    afterLevel: 10,
    icon: 'fourth-badge',
  },
];

export const MISSIONS: Mission[] = [
  {
    level: 1,
    title: '¿Dónde estás ahora?',
    subtitle: 'Definiremos el estado real del lanzamiento. Es el punto de partida honesto del camino.',
    phase: 'produccion',
    interactionTypes: ['checklist', 'riffi'],
    badgeLabel: 'Punto de partida',
    subtasks: [
      'Confirmar que tienes grabación final',
      'Indicar si la mezcla está terminada',
      'Indicar si el máster está terminado',
      'Confirmar formato de entrega correcto (.wav 24bit / 44.1kHz)',
    ],
    badgeOnComplete: 'started',
  },
  {
    level: 2,
    title: 'Prepara tu canción',
    subtitle: 'Checklist técnico de producción: mezcla, máster y formatos de entrega. Aprenderás paso a paso.',
    phase: 'produccion',
    interactionTypes: ['tareas', 'aprende'],
    badgeLabel: 'Audio listo',
    subtasks: [
      'Revisar niveles de loudness con referencia de plataforma',
      'Exportar en formato WAV y MP3',
      'Nombrar los archivos con convención correcta',
      'Guardar copia de seguridad en al menos dos ubicaciones',
    ],
  },
  {
    level: 3,
    title: 'Tu identidad visual',
    subtitle: 'La portada y el arte del lanzamiento. Incluye la herramienta cover preview y una guía de tamaños por plataforma.',
    phase: 'produccion',
    interactionTypes: ['crea', 'checklist'],
    badgeLabel: 'Arte creado',
    subtasks: [
      'Crear o encargar la portada',
      'Verificar requisitos de Spotify (3000×3000px, RGB, sin URLs)',
      'Previsualizar con la herramienta cover preview',
      'Exportar en JPG y PNG',
    ],
    badgeOnComplete: 'studio',
  },
  {
    level: 4,
    title: 'Protege tu música',
    subtitle: 'Propiedad intelectual básica: registro de obra, ISRC y lo que el artista necesita saber antes de publicar nada.',
    phase: 'release',
    interactionTypes: ['aprende', 'checklist'],
    badgeLabel: 'Obra protegida',
    subtasks: [
      'Leer qué es el ISRC y cómo se asigna',
      'Comprobar si tu distribuidora asigna ISRC automáticamente',
      'Registrar la obra en tu entidad de gestión (SGAE, ASCAP...)',
      'Guardar los códigos ISRC asignados',
    ],
  },
  {
    level: 5,
    title: 'Elijamos el gran día',
    subtitle: 'Estrategia de timing: día de la semana, antelación óptima y generación del calendario de cuenta atrás.',
    phase: 'release',
    interactionTypes: ['aprende', 'crea'],
    badgeLabel: 'Fija tu fecha de lanzamiento',
    subtasks: [
      'Leer la guía de timing por plataforma',
      'Confirmar que la fecha da tiempo para el pitch de Spotify (mín. 7 días)',
      'Fijar la fecha en Riffims',
      'Activar la cuenta atrás en la release-card',
    ],
  },
  {
    level: 6,
    title: 'Elige y configura tu distribuidora',
    subtitle: 'Comparativa de distribuidoras según el perfil del artista. Subirás tu música y configurarás la información.',
    phase: 'release',
    interactionTypes: ['aprende', 'tareas', 'riffi'],
    badgeLabel: '¡Comenzamos distribución!',
    subtasks: [
      'Elegir distribuidora o confirmar la existente',
      'Subir el archivo de audio',
      'Rellenar metadatos: título, artistas, compositores, género, idioma',
      'Configurar fecha de lanzamiento en la distribuidora',
      'Confirmar territorios de distribución',
    ],
  },
  {
    level: 7,
    title: 'Tu campaña de comunicación',
    subtitle: 'Plan de contenidos para redes: qué publicar, cuándo y cómo. Riffi puede sugerir ideas de contenido.',
    phase: 'release',
    interactionTypes: ['crea', 'tareas', 'riffi'],
    badgeLabel: '¡Campaña Creada!',
    subtasks: [
      'Definir al menos 3 publicaciones previas al lanzamiento',
      'Crear o planificar el contenido del día de lanzamiento',
      'Planificar al menos 2 publicaciones de la semana post-release',
      'Preparar al menos una pieza de contenido behind the scenes',
    ],
  },
  {
    level: 8,
    title: '¡A la prensa y más allá!',
    subtitle: 'Cómo construir y enviar un press kit básico. Cómo pitchear playlists en Spotify for Artists.',
    phase: 'release',
    interactionTypes: ['aprende', 'crea', 'tareas'],
    badgeLabel: 'Prensa lista',
    subtasks: [
      'Redactar el bio del artista (máximo 150 palabras)',
      'Preparar el press kit con portada, bio y enlace de prensa',
      'Enviar el pitch editorial en Spotify for Artists',
      'Identificar al menos 5 playlists independientes y contactar',
    ],
    badgeOnComplete: 'platforms',
  },
  {
    level: 9,
    title: '¡Ya está fuera! Mantén el impulso',
    subtitle: 'Qué hacer la semana del lanzamiento: interacción, stories, respuestas. Que no pare el movimiento.',
    phase: 'post-release',
    interactionTypes: ['tareas', 'checklist'],
    badgeLabel: '¡Música al mundo!',
    subtasks: [
      'Publicar el contenido del día de lanzamiento en todas las plataformas',
      'Responder comentarios y menciones durante las primeras 48 horas',
      'Compartir en stories con enlace directo a la canción',
      'Agradecer a quienes han compartido o guardado la canción',
    ],
  },
  {
    level: 10,
    title: 'Leamos las métricas',
    subtitle: 'Riffims enseña a interpretar streams, oyentes, guardados y reach. Nos ayudará para el siguiente lanzamiento.',
    phase: 'post-release',
    interactionTypes: ['aprende', 'riffi', 'checklist'],
    badgeLabel: 'Misión cumplida',
    subtasks: [
      'Revisar el panel de Spotify for Artists a los 7 días del lanzamiento',
      'Anotar streams, oyentes únicos y guardados',
      'Identificar de dónde vino el tráfico principal',
      'Escribir al menos una conclusión para el próximo lanzamiento',
    ],
    badgeOnComplete: 'data',
  },
];
