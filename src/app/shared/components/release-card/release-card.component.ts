import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

export type ReleaseType = 'Single' | 'EP' | 'Álbum';

@Component({
  selector: 'app-release-card',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
  ],
  templateUrl: './release-card.component.html',
  styleUrl: './release-card.component.scss',
})
export class ReleaseCard {
  @Input() title: string = 'Título del lanzamiento';
  @Input() releaseType: ReleaseType = 'Single';
  @Input() daysToRelease: number = 0;
  @Input() completedLevels: number = 0;
}
