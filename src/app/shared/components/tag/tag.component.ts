import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type TagVariant = 'default' | 'soundcheck' | 'produccion' | 'release' | 'post-release';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class Tag {
  @Input() label = '';
  @Input() variant: TagVariant = 'default';
  @Input() icon = '';
  @Input() disabled = false;
}
