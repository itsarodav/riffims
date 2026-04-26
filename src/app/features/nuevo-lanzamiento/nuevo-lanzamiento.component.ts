import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { Button } from '../../shared/components/button/button.component';
import { ChipGroupComponent, ChipOption } from '../../shared/components/chip-group/chip-group.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ReleaseService } from '../../core/services/release.service';
import { PlanningElement, ReleaseType } from '../../core/models/release.model';

@Component({
  selector: 'app-nuevo-lanzamiento',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    InputComponent,
    Button,
    ChipGroupComponent,
    IconComponent,
  ],
  templateUrl: './nuevo-lanzamiento.component.html',
  styleUrl: './nuevo-lanzamiento.component.scss',
})
export class NuevoLanzamientoComponent {
  name = '';
  releaseType: ReleaseType[] = [];
  releaseDate = '';
  hasPreviousRelease: string[] = [];
  hasDistributor: string[] = [];
  planningElements: PlanningElement[] = [];

  loading = false;
  errorMessage = '';

  nameError = '';
  typeError = '';
  dateError = '';

  typeOptions: ChipOption<ReleaseType>[] = [
    { value: 'single', label: 'Single' },
    { value: 'album', label: 'Album' },
    { value: 'ep', label: 'EP' },
  ];

  yesNoOptions: ChipOption<string>[] = [
    { value: 'si', label: 'Sí' },
    { value: 'no', label: 'No' },
  ];

  planningOptions: ChipOption<PlanningElement>[] = [
    { value: 'branding_personal', label: 'Branding personal' },
    { value: 'produccion', label: 'Producción' },
    { value: 'mezcla_masterizacion', label: 'Mezcla y masterización' },
    { value: 'propiedad_intelectual', label: 'Propiedad intelectual' },
    { value: 'distribucion_musical', label: 'Distribución musical' },
  ];

  constructor(
    private releaseService: ReleaseService,
    private router: Router
  ) {}

  validate(): boolean {
    let valid = true;
    this.nameError = '';
    this.typeError = '';
    this.dateError = '';

    if (!this.name.trim()) {
      this.nameError = 'El nombre es obligatorio';
      valid = false;
    }

    if (this.releaseType.length === 0) {
      this.typeError = 'Selecciona un tipo de lanzamiento';
      valid = false;
    }

    if (!this.releaseDate.trim()) {
      this.dateError = 'La fecha es obligatoria';
      valid = false;
    } else {
      const parsed = this.parseDateDMY(this.releaseDate);
      if (!parsed) {
        this.dateError = 'Formato inválido. Usa DD/MM/AAAA';
        valid = false;
      } else if (parsed <= new Date()) {
        this.dateError = 'La fecha debe ser en el futuro';
        valid = false;
      }
    }

    return valid;
  }

  parseDateDMY(input: string): Date | null {
    const parts = input.trim().split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (year < 2000) return null;

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  formatToISO(input: string): string {
    const date = this.parseDateDMY(input)!;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async onSubmit() {
    if (!this.validate()) return;

    this.loading = true;
    this.errorMessage = '';

    const { error } = await this.releaseService.createRelease({
      name: this.name.trim(),
      release_type: this.releaseType[0],
      release_date: this.formatToISO(this.releaseDate),
      has_previous_release: this.hasPreviousRelease[0] === 'si',
      has_distributor: this.hasDistributor[0] === 'si',
      planning_elements: this.planningElements,
    });

    this.loading = false;

    if (error) {
      this.errorMessage = 'Ocurrió un error al crear el lanzamiento. Intenta de nuevo.';
      return;
    }

    this.router.navigate(['/home']);
  }
}
