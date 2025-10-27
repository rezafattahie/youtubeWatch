import { Component, effect, inject, input, signal, ViewChild } from '@angular/core';
import { Icon } from '../icon/icon';
import { NgClass } from '@angular/common';
import { IVocab } from '../../models/vocabstorage.model';
import { IWord } from '../../models/word.model';
import { VocabStorage } from '../../services/vocab-storage-service';
import { LoginService } from '../../services/login-service';
import { ILink } from '../../models/link.model';
import { DrawerForm } from '../drawer-form/drawer-form';

@Component({
  selector: 'app-wordbook',
  imports: [Icon, NgClass, DrawerForm],
  templateUrl: './wordbook.html',
  styleUrl: './wordbook.scss',
})
export class Wordbook {
  vocabStorage = inject(VocabStorage);
  loginService = inject(LoginService);
  @ViewChild('alertDrawer') alertDrawer!: DrawerForm;
  selectedLinkId = input.required<string>();
  vocab = input<IVocab>();
  wordList = signal<{ linkId: string; words: IWord[] }[]>([]);
  currentLinkWords = signal<IWord[]>([]);
  isAnimating = signal(false);
  isSyncing = signal(false);
  userAlert = signal<{ status: string; text: string }>({ status: '', text: '' });
  showHafen = false;
  blink = false;

  constructor() {
    effect(() => {
      this.updateWordsList();
      this.isAnimating.set(true);
      setTimeout(() => this.isAnimating.set(false), 300);
    });

    effect(() => {
      const link = this.selectedLinkId();
      if (link) {
        const currentWords = this.wordList().find((group) => group.linkId === link)?.words ?? [];
        this.currentLinkWords.set(currentWords);
      }
    });
  }

  onSyncMyWords() {
    if (!this.selectedLinkId()) {
      this.isSyncing.set(false);
      this.userAlert.set({ status: 'failed', text: 'You must select a video first.' });
      this.alertDrawer.open();
    } else {
      this.isSyncing.set(true);
      this.vocabStorage
        .getVocabs(this.loginService.loggedinMember(), this.selectedLinkId())
        .subscribe({
          next: (result) => {
            let currentLinkWords: IWord[] = [];
            result.map((res) => {
              res.words.forEach((word) => {
                currentLinkWords.push(word);
              });
            });
            this.wordList.update((current) => [
              { linkId: this.selectedLinkId(), words: currentLinkWords },
              ...current,
            ]);
            this.currentLinkWords.set(currentLinkWords);
            this.isSyncing.set(false);
          },
          error: (err) => {
            this.userAlert.set({ status: 'failed', text: err.message });
            this.isSyncing.set(false);
          },
        });
    }
  }

  updateWordsList() {
    const vocab = this.vocab();
    const newWord = vocab?.words[0];
    const linkId = this.selectedLinkId();

    if (newWord && linkId) {
      this.wordList.update((list) => {
        const existingItem = list.find((item) => item.linkId === linkId);

        if (existingItem) {
          // prevent duplicate
          const exists = existingItem.words.some((w) => w.word === newWord.word);
          if (exists) return list;

          return list.map((item) =>
            item.linkId === linkId ? { ...item, words: [newWord, ...item.words] } : item
          );
        } else {
          return [{ linkId, words: [newWord] }, ...list];
        }
      });
    }
  }
}
