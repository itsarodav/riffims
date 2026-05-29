import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Tag } from '../../../shared/components/tag/tag.component';
import { MissionsService } from '../../../core/services/missions.service';
import { MISSIONS } from '../../../core/constants/missions.constants';
import { MissionTipComponent } from '../components/mission-tip/mission-tip';
import { MissionReflectionComponent } from '../components/mission-reflection/mission-reflection';
import { MissionChecklistComponent } from '../components/mission-checklist/mission-checklist';

@Component({
  selector: 'app-release-mission-detail',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    Tag,
    MissionTipComponent,
    MissionReflectionComponent,
    MissionChecklistComponent,
  ],
  templateUrl: './release-mission-detail.html',
  styleUrl: './release-mission-detail.scss',
})
export class ReleaseMissionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private missionsService = inject(MissionsService);

  releaseId = signal<string>('');
  levelNumber = signal<number>(1);

  mission = computed(() =>
    MISSIONS.find(m => m.level === this.levelNumber()) ?? MISSIONS[0]
  );

  levelLabel = computed(() =>
    this.levelNumber().toString().padStart(2, '0')
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('releaseId') ?? '';
    const level = Number(this.route.snapshot.paramMap.get('level') ?? '1');
    this.releaseId.set(id);
    this.levelNumber.set(level);
    this.missionsService.loadProgress(id);
  }

  goBack(): void {
    this.router.navigate(['/releases', this.releaseId(), 'path']);
  }

  onLevelCompleted(): void {
    this.router.navigate(
      ['/releases', this.releaseId(), 'path'],
      { queryParams: { badgeUnlocked: this.mission().badgeOnComplete ?? 'started' } }
    );
  }
}
