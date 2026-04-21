import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileHeaderComponent } from '../mobile-header/mobile-header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { RiffiPanelComponent } from '../../shared/components/riffi-panel/riffi-panel.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    MobileHeaderComponent,
    NavbarComponent,
    SidebarComponent,
    BottomNavComponent,
    RiffiPanelComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {}
