import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-music-player-mockup',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './music-player-mockup.component.html',
  styleUrl: './music-player-mockup.component.scss',
})
export class MusicPlayerMockupComponent {
  @Input() coverImageUrl: string | null = null;
  @Input() songTitle = '';
  @Input() artistName = '';
  @Input() editable = false;

  @Output() songTitleChange = new EventEmitter<string>();
  @Output() artistNameChange = new EventEmitter<string>();
  @Output() coverClicked = new EventEmitter<void>();

  @ViewChild('playerRoot', { static: true }) playerRoot!: ElementRef<HTMLElement>;

  onTitleInput(value: string): void {
    this.songTitleChange.emit(value);
  }

  onArtistInput(value: string): void {
    this.artistNameChange.emit(value);
  }

  onCoverClick(): void {
    this.coverClicked.emit();
  }
}
