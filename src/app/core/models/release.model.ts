export type ReleaseType = 'single' | 'ep' | 'album';

export type PlanningElement =
  | 'branding_personal'
  | 'produccion'
  | 'mezcla_masterizacion'
  | 'propiedad_intelectual'
  | 'distribucion_musical';

export interface Release {
  id: string;
  user_id: string;
  name: string;
  release_type: ReleaseType;
  release_date: string;
  has_previous_release: boolean;
  has_distributor: boolean;
  planning_elements: PlanningElement[];
  completed_levels: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReleaseData {
  name: string;
  release_type: ReleaseType;
  release_date: string; // formato YYYY-MM-DD
  has_previous_release: boolean;
  has_distributor: boolean;
  planning_elements: PlanningElement[];
}
