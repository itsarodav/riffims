import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-bottom-nav-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './bottom-nav-item.component.html',
  styleUrl: './bottom-nav-item.component.scss',
})
export class BottomNavItemComponent {
  @Input() iconName = '';
  @Input() label = '';
  @Input() route = '';
  @Input() variant: 'default' | 'create' | 'ai' = 'default';
}
