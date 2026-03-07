import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReleaseCard } from './shared/components/release-card/release-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReleaseCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('riffims');
}
