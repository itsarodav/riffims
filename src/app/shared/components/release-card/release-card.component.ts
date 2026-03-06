import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ReleaseType = 'Single' | 'EP' | 'Álbum';

@Component({
  selector: 'app-release-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './release-card.component.html',
  styleUrl: './release-card.component.scss',
})
export class ReleaseCard {
  @Input() title: string = 'Título del lanzamiento';
  @Input() releaseType: ReleaseType = 'Single';
  @Input() daysToRelease: number = 0;
  @Input() completedLevels: number = 0;
}
