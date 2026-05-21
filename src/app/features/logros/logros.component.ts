import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReleaseService } from '../../core/services/release.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import {
  STARTER_BADGE,
  PHASE_INFO,
  StarterBadge,
  PhaseInfo,
  BadgeId,
} from '../../core/constants/missions.constants';

interface BadgeStat {
  badge: StarterBadge | PhaseInfo;
  badgeId: BadgeId;
  unlocked: number;
  total: number;
  icon: string;
  disabledIcon: string;
  phase: string | null;
}

const DISABLED_ICONS: Record<string, string> = {
  'first-badge': 'first-badge-disabled',
  'second-badge': 'second_badge_disabled',
  'third-badge': 'third_badge_disabled',
  'fourth-badge': 'fourth_badge_disabled',
};

const BADGE_THRESHOLDS: { badgeId: BadgeId; minLevel: number }[] = [
  { badgeId: 'started', minLevel: 1 },
  { badgeId: 'studio', minLevel: 3 },
  { badgeId: 'platforms', minLevel: 8 },
  { badgeId: 'data', minLevel: 10 },
];

@Component({
  selector: 'app-logros',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './logros.component.html',
  styleUrl: './logros.component.scss',
})
export class LogrosComponent implements OnInit {
  badgeStats: BadgeStat[] = [];
  totalUnlocked = 0;
  totalPossible = 0;
  loading = true;

  constructor(
    private releaseService: ReleaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const releases = await this.releaseService.getUserReleases();
    const total = releases.length;

    const allBadges: (StarterBadge | PhaseInfo)[] = [STARTER_BADGE, ...PHASE_INFO];

    this.badgeStats = allBadges.map((badge, i) => {
      const { badgeId, minLevel } = BADGE_THRESHOLDS[i];
      const unlocked = releases.filter((r) => r.completed_levels >= minLevel).length;

      return {
        badge,
        badgeId,
        unlocked,
        total,
        icon: badge.icon,
        disabledIcon: DISABLED_ICONS[badge.icon] ?? badge.icon,
        phase: 'phase' in badge ? badge.phase : null,
      };
    });

    this.totalUnlocked = this.badgeStats.reduce((sum, s) => sum + s.unlocked, 0);
    this.totalPossible = total * 4;
    this.loading = false;
    this.cdr.detectChanges();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  getIconName(stat: BadgeStat): string {
    return stat.unlocked > 0 ? stat.icon : stat.disabledIcon;
  }

  isUnlocked(stat: BadgeStat): boolean {
    return stat.unlocked > 0;
  }
}
