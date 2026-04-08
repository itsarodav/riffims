import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../shared/components/button/button.component';
import { PROFILE_EMOJIS } from '../../data/emojis.data';

// Paso 5: elige un emoticono como avatar visual del perfil. Al finalizar,
// se activa el envío al servidor.
@Component({
  selector: 'app-step-emoji',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './step-emoji.component.html',
  styleUrl: './step-emoji.component.scss',
})
export class StepEmojiComponent {
  @Input() emoji: string | null = null;
  @Input() submitting = false;
  @Input() errorMessage = '';
  @Output() finish = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();

  readonly emojis = PROFILE_EMOJIS;

  select(e: string) {
    if (this.submitting) return;
    this.emoji = e;
  }

  onFinish() {
    if (this.emoji) this.finish.emit(this.emoji);
  }
}
