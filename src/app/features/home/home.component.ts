import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { MultiCardComponent } from '../../shared/components/multi-card/multi-card.component';
import { ReleaseCardComponent, ReleaseType as CardReleaseType } from '../../shared/components/release-card/release-card.component';
import { ReleaseService } from '../../core/services/release.service';
import { Release } from '../../core/models/release.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    MultiCardComponent,
    ReleaseCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  releases: Release[] = [];
  loading = true;

  constructor(
    private releaseService: ReleaseService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.releases = await this.releaseService.getUserReleases();
    } catch (error) {
      console.error('HomeComponent: error al cargar lanzamientos', error);
      this.releases = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get hasReleases(): boolean {
    return this.releases.length > 0;
  }

  getDaysToRelease(release: Release): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const releaseDate = new Date(release.release_date + 'T00:00:00');
    const diff = releaseDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getDisplayType(type: string): CardReleaseType {
    const map: Record<string, CardReleaseType> = {
      single: 'Single',
      ep: 'EP',
      album: 'Álbum',
    };
    return map[type] ?? 'Single';
  }

  openReleasePath(release: Release): void {
    this.router.navigate(['/releases', release.id, 'path'], {
      queryParams: { name: release.name },
    });
  }
}
