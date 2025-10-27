import { Component, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { DrawerForm } from '../drawer-form/drawer-form';
import { Icon } from '../icon/icon';
import { SubtitleService } from '../../services/subtitle-service';
import { TranslateService } from '../../services/translate-service';
import { PlayerStore } from '../../services/player-store';
import { NgClass } from '@angular/common';
import { ILink } from '../../models/link.model';
import { IVocab } from '../../models/vocabstorage.model';
import { LoginService } from '../../services/login-service';
import { VocabStorage } from '../../services/vocab-storage-service';

@Component({
  selector: 'app-subtitle',
  imports: [DrawerForm, Icon, NgClass],
  templateUrl: './subtitle.html',
  styleUrl: './subtitle.scss',
})
export class Subtitle {
  subtitleService = inject(SubtitleService);
  translateService = inject(TranslateService);
  loginService = inject(LoginService);
  vocabStorage = inject(VocabStorage);
  @ViewChild('drawer') drawer!: DrawerForm;
  inputLink = input.required<ILink>();
  isSubVisible = true;
  sendToWordbook = output<IVocab>();
  player: any;
  selectedWord: { word: string; line: string } = { word: '', line: '' };
  translation: string = '-';
  currentLine = signal<string[]>([]);

  constructor(private playerStore: PlayerStore) {
    effect(() => {
      this.currentLine.set([]);
      this.lineMaker();
    });
  }
  onSelectWord(word: string) {
    const pureWord = word.replace(/^[^0-9\p{L}]+|[^0-9\p{L}]+$/gu, '');
    this.selectedWord = {
      word: pureWord,
      line: this.currentLine().join(' '),
    };
    this.translateService.getTranslation(pureWord).subscribe({
      next: (res: any) => {
        this.drawer.open();
        if (res) this.translation = res.data.hoverDictEntries.join('، ');
        else this.translation = 'Translation not found';
        this.onVideoPause();
      },
    });
  }

  onSendSelectedWord() {
    const toWordbook: IVocab = {
      words: [
        {
          word: this.selectedWord.word,
          meaning: this.translation,
          line: this.selectedWord.line,
        },
      ],
      owner: this.loginService.loggedinMember(),
      linkId: this.inputLink().objectId ?? '',
    };
    const params = `where=linkId%3D'${toWordbook.linkId}'`;

    this.vocabStorage.saveVocab(params, toWordbook).subscribe({
      next: () => {
        this.sendToWordbook.emit(toWordbook);
        this.drawer.close();
      },
    });
  }

  lineMaker() {
    const time = this.playerStore.currentTime();
    const index = this.inputLink()!.subtitle.findIndex((s, i) => {
      const nextStart = this.inputLink()!.subtitle[i + 1]?.start ?? Infinity; // infinity = the Infinite number--->  to keep the last subtitle line to the end of video
      return time >= s.start && time < nextStart;
    });

    if (index >= 0) {
      this.currentLine.set(this.inputLink()!.subtitle[index]!.subtitle.split(' '));
    } else this.currentLine.set([]);
  }

  onVideoStart() {
    this.playerStore.shouldPause.set(false);
  }

  onVideoPause() {
    this.playerStore.shouldPause.set(true);
  }

  onToggleSubVisible() {
    this.isSubVisible = !this.isSubVisible;
  }
}
