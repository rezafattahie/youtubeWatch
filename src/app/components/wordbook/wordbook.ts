import { Component, effect, input, signal } from '@angular/core';
import { Icon } from '../icon/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-wordbook',
  imports: [Icon, NgClass],
  templateUrl: './wordbook.html',
  styleUrl: './wordbook.scss',
})
export class Wordbook {
  showHafen = false;
  blink = false;
  word = input<{ word: string; meaning:string, line: string }>();
  wordList = signal<{ word: string; meaning:string; line: string }[]>([]);
  isAnimating = signal(false);

  constructor() {
    effect(() => {
      const newWord = this.word();
      if (newWord) {
        // prevent to add duplicated word
        const exists = this.wordList().some((w) => w.word === newWord.word);
        if (!exists) {
          this.wordList.update((list) => [newWord, ...list]);  // [ ...list, newWord] => if you want the word add to the end of list
          this.isAnimating.set(true);
          setTimeout(() => {
            this.isAnimating.set(false);
          }, 100);
        }
      }
    });
  }
}
