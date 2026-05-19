import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag, TagVariant } from '../../../../shared/components/tag/tag.component';
import { Mission, MissionPhase } from '../../../../core/constants/missions.constants';

export type LevelState = 'completed' | 'active' | 'locked';

@Component({
  selector: 'app-path-level-card',
  standalone: true,
  imports: [CommonModule, Tag],
  templateUrl: './path-level-card.component.html',
  styleUrl: './path-level-card.component.scss',
})
export class PathLevelCardComponent {
  @Input({ required: true }) mission!: Mission;
  @Input({ required: true }) state: LevelState = 'locked';

  get levelNumber(): string {
    return this.mission.level.toString().padStart(2, '0');
  }

  get tagVariant(): TagVariant {
    return 'default';
  }

  get tagDisabled(): boolean {
    return this.state === 'locked';
  }

  get isActive(): boolean {
    return this.state === 'active';
  }

  get isCompleted(): boolean {
    return this.state === 'completed';
  }

  get isLocked(): boolean {
    return this.state === 'locked';
  }
}
