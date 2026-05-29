import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ReleaseCardComponent, ReleaseType as CardReleaseType } from '../../shared/components/release-card/release-card.component';
import { ReleaseService } from '../../core/services/release.service';
import { Release } from '../../core/models/release.model';

@Component({
  selector: 'app-lanzamientos',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ReleaseCardComponent,
  ],
  templateUrl: './lanzamientos.component.html',
  styleUrl: './lanzamientos.component.scss',
})
export class LanzamientosComponent implements OnInit {
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
      console.error('LanzamientosComponent: error al cargar lanzamientos', error);
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

  editRelease(release: Release): void {
    this.router.navigate(['/editar', release.id], { state: { release } });
  }

  openReleasePath(release: Release): void {
    this.router.navigate(['/releases', release.id, 'path'], {
      queryParams: { name: release.name },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
