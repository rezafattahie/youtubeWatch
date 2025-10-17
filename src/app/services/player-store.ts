import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerStore {
  currentTime = signal<number>(0);
  isPlaying = signal<boolean>(false);
  shouldPause = signal<boolean>(false);
}
