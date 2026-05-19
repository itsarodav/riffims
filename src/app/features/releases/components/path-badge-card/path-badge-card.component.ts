import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { Tag, TagVariant } from '../../../../shared/components/tag/tag.component';
import { PhaseInfo, StarterBadge } from '../../../../core/constants/missions.constants';

@Component({
  selector: 'app-path-badge-card',
  standalone: true,
  imports: [CommonModule, IconComponent, Tag],
  templateUrl: './path-badge-card.component.html',
  styleUrl: './path-badge-card.component.scss',
})
export class PathBadgeCardComponent {
  @Input({ required: true }) badge!: PhaseInfo | StarterBadge;
  @Input() unlocked = false;

  private static readonly DISABLED_ICONS: Record<string, string> = {
    'first-badge': 'first-badge-disabled',
    'second-badge': 'second_badge_disabled',
    'third-badge': 'third_badge_disabled',
    'fourth-badge': 'fourth_badge_disabled',
  };

  get isPhaseInfo(): boolean {
    return 'phase' in this.badge;
  }

  get phaseInfo(): PhaseInfo | null {
    return this.isPhaseInfo ? (this.badge as PhaseInfo) : null;
  }

  get starterBadge(): StarterBadge | null {
    return !this.isPhaseInfo ? (this.badge as StarterBadge) : null;
  }

  get tagVariant(): TagVariant {
    if (this.starterBadge) return 'soundcheck';
    const phase = this.phaseInfo;
    if (!phase) return 'default';
    return phase.phase;
  }

  get tagDisabled(): boolean {
    return !this.unlocked;
  }

  get levelsLabel(): string {
    if (this.phaseInfo) return this.phaseInfo.levels;
    return 'Misión 1 completada';
  }

  get iconName(): string {
    if (this.unlocked) return this.badge.icon;
    return PathBadgeCardComponent.DISABLED_ICONS[this.badge.icon] ?? this.badge.icon;
  }
}
