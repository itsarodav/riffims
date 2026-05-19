import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { PathLevelCardComponent } from '../components/path-level-card/path-level-card.component';
import { PathBadgeCardComponent } from '../components/path-badge-card/path-badge-card.component';
import { MissionsService } from '../../../core/services/missions.service';
import {
  MISSIONS,
  PHASE_INFO,
  STARTER_BADGE,
  PhaseInfo,
} from '../../../core/constants/missions.constants';

@Component({
  selector: 'app-release-path',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    PathLevelCardComponent,
    PathBadgeCardComponent,
  ],
  templateUrl: './release-path.component.html',
  styleUrl: './release-path.component.scss',
})
export class ReleasePathComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected missions = inject(MissionsService);

  readonly MISSIONS = MISSIONS;
  readonly STARTER_BADGE = STARTER_BADGE;

  releaseId = signal<string>('');
  releaseName = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('releaseId') ?? '';
    const name = this.route.snapshot.queryParamMap.get('name') ?? 'Tu lanzamiento';
    this.releaseId.set(id);
    this.releaseName.set(name);
    this.missions.loadProgress(id);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  getPhaseBadgeAfterLevel(level: number): PhaseInfo | null {
    return PHASE_INFO.find(p => p.afterLevel === level) ?? null;
  }
}
