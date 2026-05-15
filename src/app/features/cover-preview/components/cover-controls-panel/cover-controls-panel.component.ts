import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { CoverThumbnailGridComponent } from '../cover-thumbnail-grid/cover-thumbnail-grid.component';
import { CoverPreview } from '../../../../core/models/cover-preview.model';

@Component({
  selector: 'app-cover-controls-panel',
  standalone: true,
  imports: [CommonModule, InputComponent, CoverThumbnailGridComponent],
  templateUrl: './cover-controls-panel.component.html',
  styleUrl: './cover-controls-panel.component.scss',
})
export class CoverControlsPanelComponent {
  @Input() songTitle = '';
  @Input() artistName = '';
  @Input() covers: (CoverPreview | null)[] = [null, null, null, null];
  @Input() activeIndex = 0;

  @Output() songTitleChange = new EventEmitter<string>();
  @Output() artistNameChange = new EventEmitter<string>();
  @Output() selectCover = new EventEmitter<number>();
  @Output() uploadCover = new EventEmitter<{ position: number; file: File }>();
  @Output() deleteCover = new EventEmitter<number>();
}
