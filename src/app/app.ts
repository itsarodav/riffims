import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReleaseCardComponent } from './shared/components/release-card/release-card.component';
import { MultiCardComponent } from './shared/components/multi-card/multi-card.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    ReleaseCardComponent,
    MultiCardComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('riffims');
}
