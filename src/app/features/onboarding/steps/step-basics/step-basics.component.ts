import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ProfileService } from '../../../../core/services/profile.service';

export interface StepBasicsData {
  artist_name: string;
  username: string;
}

// Paso 2: nombre artístico + nombre de usuario. El username se valida
// contra la base de datos para garantizar su unicidad antes de avanzar.
@Component({
  selector: 'app-step-basics',
  standalone: true,
  imports: [CommonModule, Button, InputComponent],
  templateUrl: './step-basics.component.html',
  styleUrl: './step-basics.component.scss',
})
export class StepBasicsComponent {
  @Input() artistName = '';
  @Input() username = '';
  @Output() next = new EventEmitter<StepBasicsData>();
  @Output() back = new EventEmitter<void>();

  error = '';
  isChecking = false;

  constructor(private profileService: ProfileService) {}

  get canContinue(): boolean {
    return (
      this.artistName.trim().length > 0 &&
      this.username.trim().length >= 3 &&
      !this.isChecking
    );
  }

  async onContinue() {
    this.error = '';
    const name = this.artistName.trim();
    const user = this.username.trim();

    if (!name) {
      this.error = 'Introduce un nombre artístico';
      return;
    }
    if (user.length < 3) {
      this.error = 'El nombre de usuario debe tener al menos 3 caracteres';
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(user)) {
      this.error = 'El nombre de usuario sólo puede contener letras, números, . _ -';
      return;
    }

    this.isChecking = true;
    const available = await this.profileService.isUsernameAvailable(user);
    this.isChecking = false;

    if (!available) {
      this.error = 'Ese nombre de usuario ya está en uso';
      return;
    }

    this.next.emit({ artist_name: name, username: user });
  }
}
