import { Component, EventEmitter, Output, signal } from '@angular/core';
import { Tabs } from './components/tabs/tabs';
import { ITabInfo } from './models/tabInfo.model';
import { Groups } from './models/group.model';

@Component({
  selector: 'app-root',
  imports: [Tabs],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Wort Hafen');
  type: Groups = 'EasyGerman';
  @Output() toggleTransaction?: EventEmitter<void> = new EventEmitter();

  tabInfos: ITabInfo[] = [
    {
      type: 'EasyGerman',
      label: 'Easy German',
      hoverClass: 'hover:text-emerald-500 hover:bg-emerald-400/5',
      activeClass: 'text-emerald-500 bg-emerald-400/10 scale-x-130 font-medium border-t-1',
    },

    {
      type: 'Films',
      label: 'Film & Series',
      hoverClass: 'hover:text-violet-500 hover:bg-violet-400/5',
      activeClass: 'text-violet-500 bg-violet-400/10 scale-x-130 font-medium border-t-1',
    },
    {
      type: 'News',
      label: 'Tagesschau',
      hoverClass: 'hover:text-blue-500 hover:bg-blue-400/5',
      activeClass: 'text-blue-500 bg-blue-400/10 scale-x-130 font-medium border-t-1',
    },
    {
      type: 'Grammars',
      label: 'Grammar',
      hoverClass: 'hover:text-rose-400 hover:bg-rose-400/5',
      activeClass: 'bg-rose-400/10 text-rose-400 scale-x-130 font-medium border-t-1',
    },
    {
      type: 'Others',
      label: 'Others',
      hoverClass: 'hover:text-orange-500 hover:bg-orange-400/5',
      activeClass: 'text-orange-500 bg-orange-400/10 scale-x-130 font-medium border-t-1',
    },
  ];
}
