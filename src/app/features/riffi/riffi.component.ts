import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { RiffiService } from '../../core/services/riffi.service';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../core/models/profile.model';

@Component({
  selector: 'app-riffi',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: './riffi.component.html',
  styleUrl: './riffi.component.scss',
})
export class RiffiComponent implements OnInit {
  protected readonly riffi = inject(RiffiService);
  private readonly profileService = inject(ProfileService);

  protected profile = signal<Profile | null>(null);
  protected userInput = '';

  protected get displayName(): string {
    return this.profile()?.artist_name || this.profile()?.username || 'Artista';
  }

  async ngOnInit() {
    const p = await this.profileService.getCurrentProfile();
    this.profile.set(p);
  }

  send(): void {
    if (!this.userInput.trim()) return;
    this.riffi.sendMessage(this.userInput);
    this.userInput = '';
  }
}
