import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IconComponent } from '../icon/icon.component';

export type ReleaseType = 'Single' | 'EP' | 'Álbum';

@Component({
  selector: 'app-release-card',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    IconComponent,
  ],
  templateUrl: './release-card.component.html',
  styleUrl: './release-card.component.scss',
})
export class ReleaseCardComponent {
  @Input() title: string = 'Título del lanzamiento';
  @Input() releaseType: ReleaseType = 'Single';
  @Input() daysToRelease: number = 0;
  @Input() completedLevels: number = 0;
}
