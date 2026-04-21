import { Injectable, signal, computed } from '@angular/core';

export interface RiffiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class RiffiService {

  private readonly _messages = signal<RiffiMessage[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly messages = this._messages.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasMessages = computed(() => this._messages().length > 0);

  async sendMessage(userInput: string): Promise<void> {
    // TODO: llamar a Supabase Edge Function que intermedia con Gemini
    const userMessage: RiffiMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    this._messages.update(msgs => [...msgs, userMessage]);
  }

  clearHistory(): void {
    this._messages.set([]);
    this._error.set(null);
  }
}
