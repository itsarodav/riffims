import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonType = 'button' | 'submit' | 'reset';

// Componente atómico de botón. Centraliza los estilos que antes
// aparecían duplicados en login y register (clase .btn). El texto se
// recibe por proyección de contenido para que el uso resulte natural.
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: ButtonType = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = true;
}
