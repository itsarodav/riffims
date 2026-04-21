import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, IconComponent, AvatarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  protected avatarUrl = signal<string | null>(null);

  async ngOnInit() {
    const profile = await this.profileService.getCurrentProfile();
    if (profile?.avatar_url) {
      this.avatarUrl.set(profile.avatar_url);
    }
  }
}
