import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ManagerArtistService } from '../../core/services/manager-artist.service';
import { ManagerArtist } from '../../core/models/profile.model';

@Component({
  selector: 'app-artistas',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './artistas.component.html',
  styleUrl: './artistas.component.scss',
})
export class ArtistasComponent implements OnInit {
  artists: ManagerArtist[] = [];
  loading = true;

  readonly MAX_ARTISTS = 3;

  constructor(
    private managerArtistService: ManagerArtistService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.artists = await this.managerArtistService.getArtists();
    } catch (error) {
      console.error('ArtistasComponent: error al cargar artistas', error);
      this.artists = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get hasArtists(): boolean {
    return this.artists.length > 0;
  }

  get canCreateMore(): boolean {
    return this.artists.length < this.MAX_ARTISTS;
  }

  editArtist(artist: ManagerArtist): void {
    this.router.navigate(['/artistas/editar', artist.id], {
      state: { artist },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
