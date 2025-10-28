import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertServic {
  status = signal<'success' | 'failed' | 'info' | 'warning'>('success');
  messages = signal<string[]>([]);
}
