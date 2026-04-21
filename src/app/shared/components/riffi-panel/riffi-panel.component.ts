import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { RiffiService } from '../../../core/services/riffi.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-riffi-panel',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './riffi-panel.component.html',
  styleUrl: './riffi-panel.component.scss',
})
export class RiffiPanelComponent implements OnInit {
  protected readonly riffi = inject(RiffiService);
  private readonly profileService = inject(ProfileService);

  protected userName = signal('');
  protected userInput = '';

  async ngOnInit() {
    const profile = await this.profileService.getCurrentProfile();
    this.userName.set(profile?.artist_name || profile?.username || 'Artista');
  }

  send(): void {
    if (!this.userInput.trim()) return;
    this.riffi.sendMessage(this.userInput);
    this.userInput = '';
  }
}
