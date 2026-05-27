import { Component, inject, OnInit } from '@angular/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [IconComponent, AvatarComponent],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent implements OnInit {
  protected readonly profileService = inject(ProfileService);

  protected get displayName(): string {
    const p = this.profileService.profile();
    return p?.artist_name || p?.username || 'Artista';
  }

  protected get roleLabel(): string {
    const role = this.profileService.profile()?.role;
    switch (role) {
      case 'musician': return 'Músico';
      case 'singer': return 'Cantante';
      case 'band': return 'Banda';
      default: return '';
    }
  }

  async ngOnInit() {
    if (!this.profileService.profile()) {
      await this.profileService.loadProfile();
    }
  }
}
