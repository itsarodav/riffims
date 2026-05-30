import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Button } from '../../../shared/components/button/button.component';
import { ChipGroupComponent, ChipOption } from '../../../shared/components/chip-group/chip-group.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ManagerArtistService } from '../../../core/services/manager-artist.service';
import { ArtistRole } from '../../../core/models/profile.model';
import { MUSIC_GENRES, MAX_GENRES } from '../../onboarding/data/genres.data';

@Component({
  selector: 'app-crear-artista',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    InputComponent,
    Button,
    ChipGroupComponent,
    IconComponent,
  ],
  templateUrl: './crear-artista.component.html',
  styleUrl: './crear-artista.component.scss',
})
export class CrearArtistaComponent implements OnInit {
  name = '';
  emoji = '';
  role: ArtistRole[] = [];
  genres: string[] = [];

  loading = false;
  errorMessage = '';
  nameError = '';
  canCreate = true;

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
  private readonly MAX_ARTISTS = 3;

  constructor(
    private managerArtistService: ManagerArtistService,
    private router: Router
  ) {}

  async ngOnInit() {
    const artists = await this.managerArtistService.getArtists();
    if (artists.length >= this.MAX_ARTISTS) {
      this.canCreate = false;
      this.errorMessage = `Ya has alcanzado el límite de ${this.MAX_ARTISTS} artistas.`;
    }
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
    if (!this.validate() || !this.canCreate) return;

    this.loading = true;
    this.errorMessage = '';

    const { error } = await this.managerArtistService.createArtist({
      name: this.name.trim(),
      emoji: this.emoji || null,
      role: this.role.length > 0 ? this.role[0] : null,
      genres: this.genres,
    });

    this.loading = false;

    if (error) {
      this.errorMessage =
        'Ocurrió un error al crear el artista. Intenta de nuevo.';
      return;
    }

    this.router.navigate(['/artistas']);
  }
}
