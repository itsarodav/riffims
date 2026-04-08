import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../shared/components/button/button.component';
import {
  ChipGroupComponent,
  ChipOption,
} from '../../../../shared/components/chip-group/chip-group.component';
import { ArtistRole } from '../../../../core/models/profile.model';
import { ARTIST_ROLES } from '../../data/roles.data';

// Paso 3: perfil artístico. Selección única entre músico, cantante y banda.
@Component({
  selector: 'app-step-role',
  standalone: true,
  imports: [CommonModule, Button, ChipGroupComponent],
  templateUrl: './step-role.component.html',
  styleUrl: './step-role.component.scss',
})
export class StepRoleComponent {
  @Input() role: ArtistRole | null = null;
  @Output() next = new EventEmitter<ArtistRole>();
  @Output() back = new EventEmitter<void>();

  readonly options: ChipOption<ArtistRole>[] = ARTIST_ROLES.map(r => ({
    value: r.value,
    label: r.label,
    emoji: r.emoji,
  }));

  get selectedValues(): ArtistRole[] {
    return this.role ? [this.role] : [];
  }

  onSelectedChange(values: ArtistRole[]) {
    this.role = values[0] ?? null;
  }

  onContinue() {
    if (this.role) this.next.emit(this.role);
  }
}
