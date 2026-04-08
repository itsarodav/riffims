import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from '../chip/chip.component';

export type ChipGroupMode = 'single' | 'multiple';

export interface ChipOption<T = string> {
  value: T;
  label: string;
  emoji?: string;
}

// Agrupador de chips con dos modos de operación: selección única y
// selección múltiple. Encapsula la lógica para que los pasos del
// onboarding queden enfocados únicamente en su contenido.
@Component({
  selector: 'app-chip-group',
  standalone: true,
  imports: [CommonModule, ChipComponent],
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.scss',
})
export class ChipGroupComponent<T = string> {
  @Input() options: ChipOption<T>[] = [];
  @Input() mode: ChipGroupMode = 'single';
  @Input() selected: T[] = [];
  @Input() max: number | null = null;
  @Input() min = 0;

  @Output() selectedChange = new EventEmitter<T[]>();

  isSelected(value: T): boolean {
    return this.selected.includes(value);
  }

  isDisabled(value: T): boolean {
    if (this.mode !== 'multiple' || this.max === null) return false;
    if (this.isSelected(value)) return false;
    return this.selected.length >= this.max;
  }

  toggle(value: T) {
    if (this.mode === 'single') {
      this.selected = [value];
    } else {
      if (this.isSelected(value)) {
        this.selected = this.selected.filter(v => v !== value);
      } else {
        if (this.max !== null && this.selected.length >= this.max) return;
        this.selected = [...this.selected, value];
      }
    }
    this.selectedChange.emit(this.selected);
  }
}
