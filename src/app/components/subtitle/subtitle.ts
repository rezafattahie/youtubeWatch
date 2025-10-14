import { Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { DrawerForm } from '../drawer-form/drawer-form';
import { Icon } from '../icon/icon';

declare var YT: any;

@Component({
  selector: 'app-subtitle',
  imports: [DrawerForm, Icon],
  templateUrl: './subtitle.html',
  styleUrl: './subtitle.scss',
})
export class Subtitle {
  @ViewChild('drawer') drawer!: DrawerForm;
  sendToHafen = output<{ word: string; meaning: string; line: string }>();
  player: any;
  selectedWord: { word: string; line: { line: number; words: string[] } } = {
    word: '',
    line: { line: 0, words: [] },
  };
  translation: string = '  ترجمه فارسی اینجاست';
  lines = signal<{ line: number; words: string[] }[]>([
    {
      line: 1,
      words: [
        'Interactive',
        'subtitle',
        'comes',
        'here.',
        'Z.B',
        'Jetzt',
        'stehe',
        'ich',
        'auf',
        'der',
        'Straße.',
      ],
    },
  ]);

  constructor() {
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

  onSelectWord(selected: {
    word: string;
    line: { line: number; words: string[] };
    target: 'translate' | 'wordbook';
  }) {
    // if (selected.target === 'translate') this.player?.playVideo();
    // else
    this.selectedWord = { word: selected.word, line: selected.line };
    this.drawer.open();
  }

  onSendSelectedWord() {
    const toHafen = {
      word: this.selectedWord.word,
      meaning: this.translation,
      line: this.selectedWord.line.words.join(' '),
    };
    this.drawer.close();
    this.sendToHafen.emit(toHafen);
  }
}
