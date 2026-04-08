import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Chip interactivo: opción seleccionable dentro de un conjunto.
// A diferencia de app-tag (informativo), este responde a clics y teclado,
// y expone su estado via aria-pressed para tecnologías de asistencia.
@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipComponent {
  @Input() selected = false;
  @Input() disabled = false;
  @Output() toggle = new EventEmitter<void>();

  @HostBinding('attr.role') readonly role = 'button';
  @HostBinding('attr.tabindex') get tabindex() {
    return this.disabled ? -1 : 0;
  }
  @HostBinding('attr.aria-pressed') get ariaPressed() {
    return this.selected ? 'true' : 'false';
  }
  @HostBinding('attr.aria-disabled') get ariaDisabled() {
    return this.disabled ? 'true' : null;
  }
  @HostBinding('class.chip') readonly chipClass = true;
  @HostBinding('class.chip--selected') get isSelected() {
    return this.selected;
  }
  @HostBinding('class.chip--disabled') get isDisabled() {
    return this.disabled;
  }

  @HostListener('click')
  onClick() {
    if (this.disabled) return;
    this.toggle.emit();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle.emit();
    }
  }
}
