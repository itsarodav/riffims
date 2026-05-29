import { Component, Input } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-mission-tip',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mission-tip.html',
  styleUrl: './mission-tip.scss',
})
export class MissionTipComponent {
  @Input({ required: true }) tip!: string;
}
