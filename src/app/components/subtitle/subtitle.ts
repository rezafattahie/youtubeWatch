import { Component, effect, inject, input, output, signal, ViewChild } from '@angular/core';
import { DrawerForm } from '../drawer-form/drawer-form';
import { Icon } from '../icon/icon';
import { SubtitleService } from '../../services/subtitle-service';
import { TranslateService } from '../../services/translate-service';

declare var YT: any;

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

  constructor() {
    effect(() => {
      this.lines.set([]);
      this.lineMaker();
    });
    this.player = new YT.Player('yt-player', {
      videoId: 'TDRNIkVE4bw',
      events: {
        onStateChange: this.onPlayerStateChange.bind(this),
      },
    });
  }

  onPlayerStateChange(event: any) {
    if (event.data === YT.PlayerState.PLAYING) {
      alert('playing');
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      alert('playing');
    }
  }

  onSelectWord(word: string) {
    this.selectedWord = { word: word, line: this.lines() };
    this.translateService.getTranslation(word).subscribe({
      next: (res: any) => {
        (this.translation = res.data.hoverDictEntries.join('، ')), this.drawer.open();
      },
    });
  }

  onSendSelectedWord() {
    const toHafen = {
      word: this.selectedWord.word,
      meaning: this.translation,
      line: this.selectedWord.line.join(' '),
    };
    this.drawer.close();
    this.sendToHafen.emit(toHafen);
  }

  lineMaker() {
    this.subtitle()?.forEach((sub) => {
      if (sub.start === 259.239) {
        const newLine = sub.subtitle.split(' ');
        this.lines.set(newLine);
      }
    });
  }
}
