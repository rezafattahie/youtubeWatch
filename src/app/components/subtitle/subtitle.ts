import { Component, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { DrawerForm } from '../drawer-form/drawer-form';
import { Icon } from '../icon/icon';
import { SubtitleService } from '../../services/subtitle-service';
import { TranslateService } from '../../services/translate-service';
import { PlayerStore } from '../../services/player-store';

@Component({
  selector: 'app-subtitle',
  imports: [DrawerForm, Icon],
  templateUrl: './subtitle.html',
  styleUrl: './subtitle.scss',
})
export class Subtitle {
  subtitleService = inject(SubtitleService);
  translateService = inject(TranslateService);
  @ViewChild('drawer') drawer!: DrawerForm;
  subtitle = input<{ subtitle: string; start: number }[]>();
  sendToWordbook = output<{ word: string; meaning: string; line: string }>();
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
    const toWordbook = {
      word: this.selectedWord.word,
      meaning: this.translation,
      line: this.selectedWord.line,
    };
    const exist = localStorage.getItem('Robinson');
    const data = exist ? JSON.parse(exist) : [];
    data.push(toWordbook);
    localStorage.setItem('Robinson', JSON.stringify(data));
    this.drawer.close();
    this.sendToWordbook.emit(toWordbook);
  }

  lineMaker() {
    const time = this.playerStore.currentTime();
    const index = this.subtitle()!.findIndex((s, i) => {
      const nextStart = this.subtitle()![i + 1]?.start ?? Infinity; // infinity = the Infinite number--->  to keep the last subtitle line to the end of video
      return time >= s.start && time < nextStart;
    });

    if (index >= 0) {
      this.currentLine.set(this.subtitle()![index]!.subtitle.split(' '));
    } else this.currentLine.set(['']);
  }

  onVideoStart() {
    this.playerStore.shouldPause.set(false);
  }

  onVideoPause() {
    this.playerStore.shouldPause.set(true);
  }
}
