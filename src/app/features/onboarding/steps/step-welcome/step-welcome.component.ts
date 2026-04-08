import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-step-welcome',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './step-welcome.component.html',
  styleUrl: './step-welcome.component.scss',
})
export class StepWelcomeComponent {
  @Output() next = new EventEmitter<void>();
}
