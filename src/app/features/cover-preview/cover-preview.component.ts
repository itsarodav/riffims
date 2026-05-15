import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoverPreviewService } from '../../core/services/cover-preview.service';
import { CoverPreview } from '../../core/models/cover-preview.model';
import { MusicPlayerMockupComponent } from './components/music-player-mockup/music-player-mockup.component';
import { CoverControlsPanelComponent } from './components/cover-controls-panel/cover-controls-panel.component';
import { CoverThumbnailGridComponent } from './components/cover-thumbnail-grid/cover-thumbnail-grid.component';
import { Button } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-cover-preview',
  standalone: true,
  imports: [
    CommonModule,
    MusicPlayerMockupComponent,
    CoverControlsPanelComponent,
    CoverThumbnailGridComponent,
    Button,
  ],
  templateUrl: './cover-preview.component.html',
  styleUrl: './cover-preview.component.scss',
})
export class CoverPreviewComponent implements OnInit {
  songTitle = '';
  artistName = '';
  covers: (CoverPreview | null)[] = [null, null, null, null];
  activeIndex = 0;
  isExporting = false;
  isUploading = false;

  @ViewChild(MusicPlayerMockupComponent)
  playerMockup!: MusicPlayerMockupComponent;

  @ViewChild('mobileFileInput')
  mobileFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private coverService: CoverPreviewService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const userCovers = await this.coverService.getUserCovers();
    for (const cover of userCovers) {
      if (cover.position >= 0 && cover.position <= 3) {
        this.covers[cover.position] = cover;
      }
    }
    // Seleccionar el primer slot ocupado como activo
    const firstOccupied = this.covers.findIndex((c) => c !== null);
    if (firstOccupied !== -1) {
      this.activeIndex = firstOccupied;
    }
    this.cdr.detectChanges();
  }

  get hasCovers(): boolean {
    return this.covers.some((c) => c !== null);
  }

  get activeCoverUrl(): string | null {
    return this.covers[this.activeIndex]?.image_url ?? null;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  onSongTitleChange(title: string): void {
    this.songTitle = title;
  }

  onArtistNameChange(name: string): void {
    this.artistName = name;
  }

  onSelectCover(index: number): void {
    this.activeIndex = index;
  }

  async onUploadCover(event: { position: number; file: File }): Promise<void> {
    this.isUploading = true;
    const cover = await this.coverService.uploadCover(
      event.file,
      event.position
    );
    if (cover) {
      this.covers[event.position] = cover;
      this.activeIndex = event.position;
    }
    this.isUploading = false;
    this.cdr.detectChanges();
  }

  async onDeleteCover(position: number): Promise<void> {
    const cover = this.covers[position];
    if (!cover) return;

    const { error } = await this.coverService.deleteCover(
      cover.id,
      position
    );
    if (!error) {
      this.covers[position] = null;
      // Si se eliminó el cover activo se mueve al siguiente disponible
      if (this.activeIndex === position) {
        const nextOccupied = this.covers.findIndex((c) => c !== null);
        this.activeIndex = nextOccupied !== -1 ? nextOccupied : 0;
      }
    }
    this.cdr.detectChanges();
  }

  // Mobile- tap en la portada abre el selector de archivos
  onMobileCoverClick(): void {
    const firstEmpty = this.covers.findIndex((c) => c === null);
    if (firstEmpty !== -1) {
      this.mobileFileInput.nativeElement.value = '';
      this.mobileFileInput.nativeElement.click();
    }
  }

  onMobileFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const firstEmpty = this.covers.findIndex((c) => c === null);
    const position = firstEmpty !== -1 ? firstEmpty : this.activeIndex;
    this.onUploadCover({ position, file });
  }

  async exportAsJpeg(): Promise<void> {
    if (!this.playerMockup) return;
    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = this.playerMockup.playerRoot.nativeElement;
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.download = `cover-preview-${Date.now()}.jpg`;
      link.click();
    } catch (err) {
      console.error('CoverPreviewComponent.exportAsJpeg', err);
    }

    this.isExporting = false;
    this.cdr.detectChanges();
  }
}
