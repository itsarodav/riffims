import { Injectable, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { MISSIONS, PHASE_INFO, BadgeId } from '../constants/missions.constants';

@Injectable({ providedIn: 'root' })
export class MissionsService {

  private _completedLevels = signal<number>(0);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly completedLevels = this._completedLevels.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly activeMission = computed(() =>
    MISSIONS.find(m => m.level === this._completedLevels() + 1) ?? null
  );

  readonly unlockedBadges = computed<BadgeId[]>(() => {
    const level = this._completedLevels();
    const badges: BadgeId[] = [];
    if (level >= 1)  badges.push('started');
    if (level >= 3)  badges.push('studio');
    if (level >= 8)  badges.push('platforms');
    if (level >= 10) badges.push('data');
    return badges;
  });

  constructor(private supabase: SupabaseService) {}

  async loadProgress(releaseId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    const { data, error } = await this.supabase.client
      .from('releases')
      .select('completed_levels')
      .eq('id', releaseId)
      .single();

    if (error) {
      this._error.set(error.message);
    } else {
      this._completedLevels.set(data.completed_levels ?? 0);
    }

    this._loading.set(false);
  }

  getMissionState(level: number): 'completed' | 'active' | 'locked' {
    const completed = this._completedLevels();
    if (level <= completed) return 'completed';
    if (level === completed + 1) return 'active';
    return 'locked';
  }

  isBadgeUnlocked(badgeId: BadgeId): boolean {
    return this.unlockedBadges().includes(badgeId);
  }

  showStarterBadge(): boolean {
    return this._completedLevels() >= 1;
  }
}
