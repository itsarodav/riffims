import { Component } from '@angular/core';
import { BottomNavItemComponent } from '../bottom-nav-item/bottom-nav-item.component';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [BottomNavItemComponent],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {}
