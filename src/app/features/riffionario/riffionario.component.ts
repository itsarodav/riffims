import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { RiffionarioService } from '../../core/services/riffionario.service';
import { RiffionarioTerm } from '../../core/models/riffionario.model';

@Component({
  selector: 'app-riffionario',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ChipComponent],
  templateUrl: './riffionario.component.html',
  styleUrl: './riffionario.component.scss',
})
export class RiffionarioComponent implements OnInit, OnDestroy {
  protected readonly service = inject(RiffionarioService);
  private readonly router = inject(Router);

  protected searchInput = '';

  private readonly search$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.service.loadPopularTerms();
    this.service.loadRecentSearches();

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.service.updateQuery(query);
        if (query.trim().length >= 2) {
          this.service.filterTerms(query);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(value: string): void {
    this.searchInput = value;
    this.service.clearResult();
    this.search$.next(value);
  }

  selectTerm(term: RiffionarioTerm): void {
    this.searchInput = term.term;
    this.service.selectTerm(term);
  }

  askRiffi(): void {
    this.service.askRiffi(this.searchInput.trim());
  }

  clearSearch(): void {
    this.searchInput = '';
    this.service.clearResult();
    this.search$.next('');
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
