import { Injectable, signal, computed, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface RiffiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const RIFFI_CHIPS = {
  tip: 'Dame un consejo práctico y breve sobre la industria musical para un artista independiente. Algo que pueda aplicar hoy mismo.',
  riffionario:
    'Explícame un término importante de la industria musical que todo artista independiente debería conocer. Incluye la palabra, su definición y un ejemplo práctico.',
  idea: 'Sugiéreme una idea creativa para promocionar mi próximo lanzamiento musical en redes sociales. Sé específico con el formato y la plataforma.',
} as const;

export type RiffiChipAction = keyof typeof RIFFI_CHIPS;

const MAX_CONTEXT_MESSAGES = 20;

@Injectable({ providedIn: 'root' })
export class RiffiService {
  private readonly supabase = inject(SupabaseService);

  private readonly _messages = signal<RiffiMessage[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly messages = this._messages.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasMessages = computed(() => this._messages().length > 0);

  async sendMessage(userInput: string): Promise<void> {
    const trimmed = userInput.trim();
    if (!trimmed || this._loading()) return;

    const userMessage: RiffiMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    this._messages.update((msgs) => [...msgs, userMessage]);
    this._loading.set(true);
    this._error.set(null);

    try {
      const contextMessages = this._messages()
        .slice(-MAX_CONTEXT_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content }));

      const { data, error } = await this.supabase.client.functions.invoke(
        'riffi-chat',
        { body: { messages: contextMessages } }
      );

      if (error) throw error;

      const assistantMessage: RiffiMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };
      this._messages.update((msgs) => [...msgs, assistantMessage]);
    } catch (err) {
      this._error.set(
        'Ups, algo falló. Intenta de nuevo en unos segundos.'
      );
      console.error('RiffiService.sendMessage error:', err);
    } finally {
      this._loading.set(false);
    }
  }

  sendChipAction(action: RiffiChipAction): void {
    this.sendMessage(RIFFI_CHIPS[action]);
  }

  clearHistory(): void {
    this._messages.set([]);
    this._error.set(null);
  }
}
