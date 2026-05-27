import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import {
  RiffionarioTerm,
  RiffionarioSearch,
  RiffionarioResult,
} from '../models/riffionario.model';

@Injectable({ providedIn: 'root' })
export class RiffionarioService {
  private readonly supabase = inject(SupabaseService);

  private readonly _searchQuery = signal<string>('');
  private readonly _filteredTerms = signal<RiffionarioTerm[]>([]);
  private readonly _popularTerms = signal<RiffionarioTerm[]>([]);
  private readonly _recentSearches = signal<RiffionarioSearch[]>([]);
  private readonly _selectedResult = signal<RiffionarioResult | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _aiLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly searchQuery = this._searchQuery.asReadonly();
  readonly filteredTerms = this._filteredTerms.asReadonly();
  readonly popularTerms = this._popularTerms.asReadonly();
  readonly recentSearches = this._recentSearches.asReadonly();
  readonly selectedResult = this._selectedResult.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly aiLoading = this._aiLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasQuery = computed(() => this._searchQuery().trim().length >= 2);
  readonly hasResults = computed(() => this._filteredTerms().length > 0);
  readonly showDefault = computed(
    () => !this.hasQuery() && !this._selectedResult()
  );
  readonly showNoResults = computed(
    () =>
      this.hasQuery() &&
      !this.hasResults() &&
      !this._loading() &&
      !this._selectedResult()
  );

  async loadPopularTerms(): Promise<void> {
    try {
      const { data, error } = await this.supabase.client
        .from('riffionario_terms')
        .select('*')
        .order('search_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      this._popularTerms.set((data as RiffionarioTerm[]) ?? []);
    } catch (err) {
      console.error('RiffionarioService.loadPopularTerms', err);
    }
  }

  async loadRecentSearches(): Promise<void> {
    try {
      const { data: sessionData } = await this.supabase.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data, error } = await this.supabase.client
        .from('riffionario_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      this._recentSearches.set((data as RiffionarioSearch[]) ?? []);
    } catch (err) {
      console.error('RiffionarioService.loadRecentSearches', err);
    }
  }

  async filterTerms(query: string): Promise<void> {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      this._filteredTerms.set([]);
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    try {
      const { data, error } = await this.supabase.client
        .from('riffionario_terms')
        .select('*')
        .ilike('term', `%${trimmed}%`)
        .order('term');

      if (error) throw error;
      this._filteredTerms.set((data as RiffionarioTerm[]) ?? []);
    } catch (err) {
      console.error('RiffionarioService.filterTerms', err);
      this._error.set('Error al buscar términos.');
    } finally {
      this._loading.set(false);
    }
  }

  async selectTerm(term: RiffionarioTerm): Promise<void> {
    this._selectedResult.set({
      term: term.term,
      definition: term.definition,
      category: term.category,
      source: 'database',
      termId: term.id,
    });
    this._filteredTerms.set([]);
    this.logSearch(term.id, term.term);
  }

  async askRiffi(query: string): Promise<void> {
    const trimmed = query.trim();
    if (!trimmed || this._aiLoading()) return;

    this._aiLoading.set(true);
    this._error.set(null);

    try {
      const prompt = `Define de forma clara y breve el siguiente término de la industria musical: "${trimmed}". Responde solo con la definición, sin repetir el término al inicio.`;

      const { data, error } = await this.supabase.client.functions.invoke(
        'riffi-chat',
        { body: { messages: [{ role: 'user', content: prompt }] } }
      );

      if (error) throw error;

      this._selectedResult.set({
        term: trimmed,
        definition: data.reply,
        category: null,
        source: 'ai',
        termId: null,
      });
      this._filteredTerms.set([]);
      this.logSearch(null, trimmed);
    } catch (err) {
      console.error('RiffionarioService.askRiffi', err);
      this._error.set('Riffi no pudo responder. Inténtalo de nuevo.');
    } finally {
      this._aiLoading.set(false);
    }
  }

  private async logSearch(
    termId: string | null,
    query: string
  ): Promise<void> {
    try {
      const { data: sessionData } = await this.supabase.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      await this.supabase.client.from('riffionario_searches').insert({
        user_id: userId,
        term_id: termId,
        search_query: query,
      });

      if (termId) {
        await this.supabase.client.rpc('increment_term_search_count', {
          p_term_id: termId,
        });
      }

      this.loadRecentSearches();
    } catch (err) {
      console.error('RiffionarioService.logSearch', err);
    }
  }

  clearResult(): void {
    this._selectedResult.set(null);
    this._searchQuery.set('');
    this._filteredTerms.set([]);
    this._error.set(null);
  }

  updateQuery(query: string): void {
    this._searchQuery.set(query);
    if (query.trim().length < 2) {
      this._filteredTerms.set([]);
    }
  }
}
