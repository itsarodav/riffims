import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Button } from '../../../shared/components/button/button.component';
import { ChipGroupComponent, ChipOption } from '../../../shared/components/chip-group/chip-group.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ManagerArtistService } from '../../../core/services/manager-artist.service';
import { ArtistRole, ManagerArtist } from '../../../core/models/profile.model';
import { MUSIC_GENRES, MAX_GENRES } from '../../onboarding/data/genres.data';

@Component({
  selector: 'app-editar-artista',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    InputComponent,
    Button,
    ChipGroupComponent,
    IconComponent,
  ],
  templateUrl: './editar-artista.component.html',
  styleUrl: './editar-artista.component.scss',
})
export class EditarArtistaComponent implements OnInit {
  name = '';
  emoji = '';
  role: ArtistRole[] = [];
  genres: string[] = [];

  loading = false;
  loadingData = false;
  deleting = false;
  errorMessage = '';
  nameError = '';
  confirmingDelete = false;

  private artistId: string | null = null;

  roleOptions: ChipOption<ArtistRole>[] = [
    { value: 'musician', label: 'Músico' },
    { value: 'singer', label: 'Cantante' },
    { value: 'band', label: 'Banda' },
  ];

  genreOptions: ChipOption<string>[] = MUSIC_GENRES.map((g) => ({
    value: g,
    label: g,
  }));

  readonly maxGenres = MAX_GENRES;

  constructor(
    private managerArtistService: ManagerArtistService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.artistId = this.route.snapshot.paramMap.get('artistId');

    if (this.artistId) {
      const navState = history.state as { artist?: ManagerArtist };
      let artist = navState?.artist ?? null;

      if (!artist) {
        this.loadingData = true;
        artist = await this.managerArtistService.getArtistById(this.artistId);
        this.loadingData = false;
      }

      if (artist) {
        this.prefillForm(artist);
      }
    }
  }

  private prefillForm(artist: ManagerArtist) {
    this.name = artist.name;
    this.emoji = artist.emoji ?? '';
    this.role = artist.role ? [artist.role] : [];
    this.genres = artist.genres ?? [];
  }

  validate(): boolean {
    this.nameError = '';

    if (!this.name.trim()) {
      this.nameError = 'El nombre es obligatorio';
      return false;
    }

    return true;
  }

  async onSubmit() {
    if (!this.validate() || !this.artistId) return;

    this.loading = true;
    this.errorMessage = '';

    const { error } = await this.managerArtistService.updateArtist(
      this.artistId,
      {
        name: this.name.trim(),
        emoji: this.emoji || null,
        role: this.role.length > 0 ? this.role[0] : null,
        genres: this.genres,
      }
    );

    this.loading = false;

    if (error) {
      this.errorMessage =
        'Ocurrió un error al guardar los cambios. Intenta de nuevo.';
      return;
    }

    this.router.navigate(['/artistas']);
  }

  onDeleteClick() {
    this.confirmingDelete = true;
  }

  onCancelDelete() {
    this.confirmingDelete = false;
  }

  async onConfirmDelete() {
    if (!this.artistId) return;

    this.deleting = true;
    this.errorMessage = '';

    const { error } = await this.managerArtistService.deleteArtist(
      this.artistId
    );
    this.deleting = false;

    if (error) {
      this.errorMessage =
        'Ocurrió un error al eliminar el artista. Intenta de nuevo.';
      this.confirmingDelete = false;
      return;
    }

    this.router.navigate(['/artistas']);
  }
}
