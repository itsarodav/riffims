import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReleaseCardComponent } from './shared/components/release-card/release-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReleaseCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('riffims');
}
