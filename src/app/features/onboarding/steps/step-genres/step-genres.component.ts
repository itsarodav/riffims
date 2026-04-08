import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../shared/components/button/button.component';
import {
  ChipGroupComponent,
  ChipOption,
} from '../../../../shared/components/chip-group/chip-group.component';
import { MAX_GENRES, MIN_GENRES, MUSIC_GENRES } from '../../data/genres.data';

// Paso 4: géneros. Selección múltiple con mínimo 1 y máximo 5.
@Component({
  selector: 'app-step-genres',
  standalone: true,
  imports: [CommonModule, Button, ChipGroupComponent],
  templateUrl: './step-genres.component.html',
  styleUrl: './step-genres.component.scss',
})
export class StepGenresComponent {
  @Input() genres: string[] = [];
  @Output() next = new EventEmitter<string[]>();
  @Output() back = new EventEmitter<void>();

  readonly min = MIN_GENRES;
  readonly max = MAX_GENRES;
  readonly options: ChipOption<string>[] = MUSIC_GENRES.map(g => ({
    value: g,
    label: g,
  }));

  onSelectedChange(values: string[]) {
    this.genres = values;
  }

  get canContinue(): boolean {
    return this.genres.length >= this.min;
  }

  onContinue() {
    if (this.canContinue) this.next.emit(this.genres);
  }
}
