import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
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

  @ViewChildren(MusicPlayerMockupComponent)
  playerMockups!: QueryList<MusicPlayerMockupComponent>;

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

  private getVisiblePlayer(): MusicPlayerMockupComponent | null {
    const players = this.playerMockups?.toArray() ?? [];
    return (
      players.find(
        (p) => p.playerRoot.nativeElement.offsetWidth > 0
      ) ?? null
    );
  }

  async exportAsJpeg(): Promise<void> {
    const player = this.getVisiblePlayer();
    if (!player) return;
    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = player.playerRoot.nativeElement;

      const canvas = await html2canvas(element, {
        backgroundColor: '#18181b',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        onclone: async (_doc: Document, clonedEl: HTMLElement) => {
          // Convertir imágenes cross-origin a data URLs en el CLON
          const imgs = clonedEl.querySelectorAll('img');
          for (const img of imgs) {
            if (!img.src || img.src.startsWith('data:')) continue;
            try {
              const res = await fetch(img.src);
              const blob = await res.blob();
              const dataUrl: string = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
              img.src = dataUrl;
            } catch {
              // Si falla el fetch, dejar la imagen original
            }
          }
        },
      });

      const jpegBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.92)
      );

      if (jpegBlob) {
        const url = URL.createObjectURL(jpegBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cover-preview-${Date.now()}.jpg`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('CoverPreviewComponent.exportAsJpeg', err);
    }

    this.isExporting = false;
    this.cdr.detectChanges();
  }
}
