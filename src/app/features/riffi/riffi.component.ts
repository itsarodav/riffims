import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { RiffiService } from '../../core/services/riffi.service';

@Component({
  selector: 'app-riffi',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: './riffi.component.html',
  styleUrl: './riffi.component.scss',
})
export class RiffiComponent {
  protected readonly riffi = inject(RiffiService);
  protected userInput = '';

  send(): void {
    if (!this.userInput.trim()) return;
    this.riffi.sendMessage(this.userInput);
    this.userInput = '';
  }
}
