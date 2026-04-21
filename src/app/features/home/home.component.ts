import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { MultiCardComponent } from '../../shared/components/multi-card/multi-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IconComponent, MultiCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
