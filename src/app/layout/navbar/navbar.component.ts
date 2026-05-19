import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private routerSub!: Subscription;

  protected avatarUrl = signal<string | null>(null);
  protected pageTitle = signal<string>('Inicio');

  async ngOnInit() {
    const profile = await this.profileService.getCurrentProfile();
    if (profile?.avatar_url) {
      this.avatarUrl.set(profile.avatar_url);
    }

    this.updateTitle();
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.updateTitle());
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private updateTitle(): void {
    let current = this.route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    const title = current.snapshot.data['pageTitle'] as string | undefined;
    this.pageTitle.set(title ?? 'Inicio');
  }
}
