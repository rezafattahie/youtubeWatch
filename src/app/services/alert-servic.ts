import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertServic {
  status = signal<'success' | 'failed' | 'info' | 'warning'>('success');
  messages = signal<string[]>(['']);
  isOpen = signal(false);

  show(options: {
    status: 'success' | 'failed' | 'info' | 'warning';
    message: string[];
    isOpen: boolean;
  }) {
    this.status.set(options.status);
    this.messages.set(options.message);
    this.isOpen.set(options.isOpen);
  }
}
