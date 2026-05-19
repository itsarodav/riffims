import { Component, inject, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { RiffiService, RiffiChipAction } from '../../core/services/riffi.service';
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

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;

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
    this.scrollToBottom();
  }

  onChip(action: RiffiChipAction): void {
    this.riffi.sendChipAction(action);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }
}
