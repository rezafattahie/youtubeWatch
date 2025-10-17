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
  sendToHafen = output<{ word: string; meaning: string; line: string }>();
  player: any;
  selectedWord: { word: string; line: string[] } = {
    word: '',
    line: [],
  };
  translation: string = '-';
  lines = signal<string[]>([]);

  constructor(private playerStore: PlayerStore) {
    effect(() => {
      this.lines.set([]);
      this.lineMaker();
    });
  }

  onSelectWord(word: string) {
    this.selectedWord = { word: word, line: this.lines() };
    this.translateService.getTranslation(word).subscribe({
      next: (res: any) => {
        this.drawer.open();
        if (res) this.translation = res.data.hoverDictEntries.join('، ');
        else this.translation = 'Translation not found';
        this.onVideoPause();
      },
      error: (err) => {
        console.log('%csrc\app\components\subtitle\subtitle.ts:45 err', 'color: #ff9100ff;', err);;
      },
    });
  }

  onSendSelectedWord() {
    const toHafen = {
      word: this.selectedWord.word,
      meaning: this.translation,
      line: this.selectedWord.line.join(' '),
    };
    localStorage.getItem('Robinson')
    this.drawer.close();
    this.onVideoStart();
    this.sendToHafen.emit(toHafen);
  }

  lineMaker() {
    const time = this.playerStore.currentTime();
    const index = this.subtitle()!.findIndex((s, i) => {
      const nextStart = this.subtitle()![i + 1]?.start ?? Infinity;  // infinity = the Infinite number--->  to keep the last subtitle line to the end of video
      return time >= s.start && time < nextStart;
    });

    if (index >= 0) {
      this.lines.set(this.subtitle()![index]!.subtitle.split(' '));
    } else this.lines.set(['']);
  }
  onVideoStart() {
    this.playerStore.shouldPause.set(true);
  }

  onVideoPause() {
    this.playerStore.shouldPause.set(false);
  }
}
