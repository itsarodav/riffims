import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../shared/components/button/button.component';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { MissionsService } from '../../../../core/services/missions.service';

@Component({
  selector: 'app-mission-checklist',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './mission-checklist.html',
  styleUrl: './mission-checklist.scss',
})
export class MissionChecklistComponent implements OnInit {
  @Input({ required: true }) subtasks!: string[];
  @Input({ required: true }) releaseId!: string;
  @Input({ required: true }) levelNumber!: number;
  @Output() levelCompleted = new EventEmitter<void>();

  private supabase = inject(SupabaseService);
  private missionsService = inject(MissionsService);

  checkedItems = signal<boolean[]>([]);
  isSaving = signal<boolean>(false);

  completedCount = computed(() => this.checkedItems().filter(Boolean).length);
  allCompleted = computed(() => this.completedCount() === this.subtasks.length);
  progressPercent = computed(() =>
    this.subtasks.length > 0
      ? (this.completedCount() / this.subtasks.length) * 100
      : 0
  );

  async ngOnInit(): Promise<void> {
    this.checkedItems.set(new Array(this.subtasks.length).fill(false));
    await this.loadExistingState();
  }

  async onCheckChange(index: number, checked: boolean): Promise<void> {
    const items = [...this.checkedItems()];
    items[index] = checked;
    this.checkedItems.set(items);

    const userId = (await this.supabase.client.auth.getUser()).data.user?.id ?? '';
    await this.supabase.client
      .from('tasks')
      .upsert(
        {
          release_id: this.releaseId,
          user_id: userId,
          level_number: this.levelNumber,
          type: 'checklist',
          title: this.subtasks[index],
          is_completed: checked,
        },
        { onConflict: 'release_id,level_number,type,title' }
      );
  }

  async completeLevel(): Promise<void> {
    if (!this.allCompleted() || this.isSaving()) return;

    this.isSaving.set(true);
    try {
      await this.missionsService.completeLevel(this.releaseId, this.levelNumber);
      this.levelCompleted.emit();
    } catch (error) {
      console.error('Error completing level:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  private async loadExistingState(): Promise<void> {
    const { data } = await this.supabase.client
      .from('tasks')
      .select('title, is_completed')
      .eq('release_id', this.releaseId)
      .eq('level_number', this.levelNumber)
      .eq('type', 'checklist');

    if (data && data.length > 0) {
      const items = [...this.checkedItems()];
      for (const task of data) {
        const idx = this.subtasks.indexOf(task.title);
        if (idx !== -1) items[idx] = task.is_completed;
      }
      this.checkedItems.set(items);
    }
  }
}
