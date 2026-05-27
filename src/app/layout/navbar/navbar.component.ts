import { Component, inject, OnInit } from '@angular/core';
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
  protected readonly profileService = inject(ProfileService);

  async ngOnInit() {
    if (!this.profileService.profile()) {
      await this.profileService.loadProfile();
    }
  }
}
