import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel';

// Componente atómico de campo de texto. Reemplaza la clase .input-field
// que se duplicaba en login y register.
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() name = '';
  @Input() autocomplete = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint = '';
  @Input() error = '';
  @Input() hideLabel = false;

  // Identificador único por instancia, para asociar label e input.
  readonly inputId = `app-input-${Math.random().toString(36).slice(2, 9)}`;

  onInput(next: string) {
    this.value = next;
    this.valueChange.emit(next);
  }
}
