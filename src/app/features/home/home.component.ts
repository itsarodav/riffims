import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { MultiCardComponent } from '../../shared/components/multi-card/multi-card.component';
import { ReleaseCardComponent, ReleaseType as CardReleaseType } from '../../shared/components/release-card/release-card.component';
import { ReleaseService } from '../../core/services/release.service';
import { ProfileService } from '../../core/services/profile.service';
import { ManagerArtistService } from '../../core/services/manager-artist.service';
import { Release } from '../../core/models/release.model';
import { ManagerArtist } from '../../core/models/profile.model';

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

  // Manager state
  isManager = false;
  artists: ManagerArtist[] = [];
  selectedArtist: ManagerArtist | null = null;

  constructor(
    private releaseService: ReleaseService,
    private profileService: ProfileService,
    private managerArtistService: ManagerArtistService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const profile = this.profileService.profile();
      this.isManager = profile?.profile_type === 'manager';

      if (this.isManager) {
        this.artists = await this.managerArtistService.getArtists();
      } else {
        this.releases = await this.releaseService.getUserReleases();
      }
    } catch (error) {
      console.error('HomeComponent: error al cargar datos', error);
      this.releases = [];
      this.artists = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get hasReleases(): boolean {
    return this.releases.length > 0;
  }

  get hasArtists(): boolean {
    return this.artists.length > 0;
  }

  async selectArtist(artist: ManagerArtist) {
    this.selectedArtist = artist;
    this.loading = true;
    try {
      this.releases = await this.releaseService.getArtistReleases(artist.id);
    } catch (error) {
      console.error('HomeComponent: error al cargar releases del artista', error);
      this.releases = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  deselectArtist() {
    this.selectedArtist = null;
    this.releases = [];
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

  createReleaseForArtist(): void {
    if (this.selectedArtist) {
      this.router.navigate(['/nuevo'], {
        queryParams: { artistId: this.selectedArtist.id },
      });
    }
  }
}
