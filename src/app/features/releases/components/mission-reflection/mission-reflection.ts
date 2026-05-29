import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-mission-reflection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mission-reflection.html',
  styleUrl: './mission-reflection.scss',
})
export class MissionReflectionComponent implements OnInit, OnDestroy {
  @Input({ required: true }) question!: string;
  @Input({ required: true }) releaseId!: string;
  @Input({ required: true }) levelNumber!: number;
  @Output() saved = new EventEmitter<string>();

  private supabase = inject(SupabaseService);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  answer = signal<string>('');
  saveStatus = signal<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async ngOnInit(): Promise<void> {
    await this.loadExistingAnswer();
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  onInput(value: string): void {
    this.answer.set(value);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.saveAnswer(), 800);
  }

  private async loadExistingAnswer(): Promise<void> {
    const { data } = await this.supabase.client
      .from('tasks')
      .select('notes')
      .eq('release_id', this.releaseId)
      .eq('level_number', this.levelNumber)
      .eq('type', 'reflection')
      .eq('title', 'reflection-answer')
      .maybeSingle();

    if (data?.notes) {
      this.answer.set(data.notes);
    }
  }

  private async saveAnswer(): Promise<void> {
    const text = this.answer();
    if (!text.trim()) return;

    this.saveStatus.set('saving');

    const userId = (await this.supabase.client.auth.getUser()).data.user?.id ?? '';
    const { error } = await this.supabase.client
      .from('tasks')
      .upsert(
        {
          release_id: this.releaseId,
          user_id: userId,
          level_number: this.levelNumber,
          type: 'reflection',
          title: 'reflection-answer',
          notes: text,
          is_completed: false,
        },
        { onConflict: 'release_id,level_number,type,title' }
      );

    if (error) {
      console.error('Error saving reflection:', error);
      this.saveStatus.set('error');
    } else {
      this.saveStatus.set('saved');
      this.saved.emit(text);
    }
  }
}
