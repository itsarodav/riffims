import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
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

    const badgeUnlocked = this.route.snapshot.queryParamMap.get('badgeUnlocked');
    if (badgeUnlocked) {
      setTimeout(() => this.animateBadgeUnlock(badgeUnlocked), 100);
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  navigateToMission(level: number): void {
    const state = this.missions.getMissionState(level);
    console.log('[navigateToMission]', { level, state, releaseId: this.releaseId() });
    if (state === 'locked') return;
    this.router.navigate(['/releases', this.releaseId(), 'path', level]);
  }

  getPhaseBadgeAfterLevel(level: number): PhaseInfo | null {
    return PHASE_INFO.find(p => p.afterLevel === level) ?? null;
  }

  private animateBadgeUnlock(badgeId: string): void {
    const el = document.querySelector(`[data-badge-id="${badgeId}"]`);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    gsap.fromTo(el,
      { scale: 0.85, opacity: 0.5 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        delay: 0.3,
      }
    );
  }
}
