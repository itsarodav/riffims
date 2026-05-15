import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { CoverPreview } from '../../../../core/models/cover-preview.model';

@Component({
  selector: 'app-cover-thumbnail-grid',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './cover-thumbnail-grid.component.html',
  styleUrl: './cover-thumbnail-grid.component.scss',
})
export class CoverThumbnailGridComponent {
  @Input() covers: (CoverPreview | null)[] = [null, null, null, null];
  @Input() activeIndex = 0;

  @Output() selectCover = new EventEmitter<number>();
  @Output() uploadCover = new EventEmitter<{ position: number; file: File }>();
  @Output() deleteCover = new EventEmitter<number>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  dragOverIndex: number | null = null;
  dragOverEmpty = false;
  private pendingPosition = 0;

  get allEmpty(): boolean {
    return this.covers.every((c) => c === null);
  }

  onSlotClick(index: number): void {
    if (this.covers[index]) {
      this.selectCover.emit(index);
    } else {
      this.triggerUpload(index);
    }
  }

  onDeleteClick(event: Event, index: number): void {
    event.stopPropagation();
    this.deleteCover.emit(index);
  }

  triggerUpload(position: number): void {
    this.pendingPosition = position;
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.uploadCover.emit({ position: this.pendingPosition, file });
    }
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    this.dragOverIndex = index;
  }

  onDragLeave(index: number): void {
    if (this.dragOverIndex === index) {
      this.dragOverIndex = null;
    }
  }

  onEmptyClick(): void {
    this.triggerUpload(0);
  }

  onEmptyDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOverEmpty = true;
  }

  onEmptyDragLeave(): void {
    this.dragOverEmpty = false;
  }

  onEmptyDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOverEmpty = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.uploadCover.emit({ position: 0, file });
    }
  }

  onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    this.dragOverIndex = null;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.uploadCover.emit({ position: index, file });
    }
  }
}
