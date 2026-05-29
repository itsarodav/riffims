import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../shared/components/button/button.component';
import {
  ChipGroupComponent,
  ChipOption,
} from '../../../../shared/components/chip-group/chip-group.component';
import {
  ProfileType,
  PROFILE_TYPES,
} from '../../data/profile-types.data';

@Component({
  selector: 'app-step-profile-type',
  standalone: true,
  imports: [CommonModule, Button, ChipGroupComponent],
  templateUrl: './step-profile-type.component.html',
  styleUrl: './step-profile-type.component.scss',
})
export class StepProfileTypeComponent {
  @Input() profileType: ProfileType | null = null;
  @Output() next = new EventEmitter<ProfileType>();
  @Output() back = new EventEmitter<void>();

  readonly options: ChipOption<ProfileType>[] = PROFILE_TYPES.map(pt => ({
    value: pt.value,
    label: pt.label,
    emoji: pt.emoji,
  }));

  comingSoonVisible = false;

  get selectedValues(): ProfileType[] {
    return this.profileType ? [this.profileType] : [];
  }

  onSelectedChange(values: ProfileType[]) {
    this.profileType = values[0] ?? null;
    this.comingSoonVisible = this.profileType
      ? (PROFILE_TYPES.find(pt => pt.value === this.profileType)?.comingSoon ?? false)
      : false;
  }

  onContinue() {
    if (this.profileType && !this.comingSoonVisible) {
      this.next.emit(this.profileType);
    }
  }
}
