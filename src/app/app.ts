import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReleaseCardComponent } from './shared/components/release-card/release-card.component';
import { MultiCardComponent } from './shared/components/multi-card/multi-card.component';
import { IconComponent } from './shared/components/icon/icon.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    ReleaseCardComponent,
    MultiCardComponent,
    IconComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('riffims');
}
