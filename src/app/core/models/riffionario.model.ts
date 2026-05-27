export interface RiffionarioTerm {
  id: string;
  term: string;
  definition: string;
  category: string | null;
  search_count: number;
  created_at: string;
  updated_at: string;
}

export interface RiffionarioSearch {
  id: string;
  user_id: string;
  term_id: string | null;
  search_query: string;
  created_at: string;
}

export interface RiffionarioResult {
  term: string;
  definition: string;
  category: string | null;
  source: 'database' | 'ai';
  termId: string | null;
}
