import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconSize } from '../icon/icon.component';

export type MultiCardVariant = 'feature' | 'empty' | 'riffi-tip';

@Component({
  selector: 'app-multi-card',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
  ],
  templateUrl: './multi-card.component.html',
  styleUrl: './multi-card.component.scss',
})
export class MultiCardComponent {
  @Input() variant: MultiCardVariant = 'feature';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() iconName: string = '';
  @Input() iconSize: IconSize = 24;
}
