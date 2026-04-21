import { Component, inject, OnInit, signal } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../core/models/profile.model';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [IconComponent, AvatarComponent],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent implements OnInit {
  private readonly profileService = inject(ProfileService);

  protected profile = signal<Profile | null>(null);

  protected get displayName(): string {
    return this.profile()?.artist_name || this.profile()?.username || 'Artista';
  }

  protected get roleLabel(): string {
    const role = this.profile()?.role;
    switch (role) {
      case 'musician': return 'Músico';
      case 'singer': return 'Cantante';
      case 'band': return 'Banda';
      default: return '';
    }
  }

  async ngOnInit() {
    const p = await this.profileService.getCurrentProfile();
    this.profile.set(p);
  }
}
