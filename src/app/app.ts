import { Component, computed, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { Tabs } from './components/tabs/tabs';
import { ITabInfo } from './models/tabInfo.model';
import { Groups } from './models/group.model';
import { RouterModule } from '@angular/router';
import { LoginService } from './services/login-service';
import { Alert } from './components/alert/alert';

@Component({
  selector: 'app-root',
  imports: [Tabs, RouterModule, Alert],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('Wort Hafen');
  loginService = inject(LoginService);
  currentMember = computed(() => this.loginService.loggedinMember());
  type: Groups = 'easygerman';
  @Output() toggleTransaction?: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {
    const emailApiId = 'ED04C550-BD52-4725-B4B2-A6EA07C2BB58';
    const emailApiKey = 'B06323D9-2CCF-40A2-8670-E6178BCB6270';
    Backendless.initApp(emailApiId, emailApiKey);
    for (let i = 0; i < localStorage.length; i++) {
      const keyData = localStorage.getItem(localStorage.key(i)!);
      if (keyData && JSON.parse(keyData).stayLogin == true)
        this.loginService.loggedinMember.set(localStorage.key(i)!);
    }
  }

  tabInfos: ITabInfo[] = [
    {
      type: 'easygerman',
      label: 'Easy German',
      hoverClass: 'hover:text-emerald-500 hover:bg-emerald-400/5',
      activeClass: 'text-emerald-500 bg-emerald-400/10 scale-x-130 font-medium border-t-1',
    },

    {
      type: 'films',
      label: 'Film & Series',
      hoverClass: 'hover:text-violet-500 hover:bg-violet-400/5',
      activeClass: 'text-violet-500 bg-violet-400/10 scale-x-130 font-medium border-t-1',
    },
    {
      type: 'news',
      label: 'Tagesschau',
      hoverClass: 'hover:text-blue-500 hover:bg-blue-400/5',
      activeClass: 'text-blue-500 bg-blue-400/10 scale-x-130 font-medium border-t-1',
    },
    {
      type: 'grammars',
      label: 'Grammar',
      hoverClass: 'hover:text-rose-400 hover:bg-rose-400/5',
      activeClass: 'bg-rose-400/10 text-rose-400 scale-x-130 font-medium border-t-1',
    },
    {
      type: 'others',
      label: '',
      hoverClass: 'hover:text-orange-500 hover:bg-orange-400/5',
      activeClass: 'text-orange-500 bg-orange-400/10 scale-x-130 font-bold border-t-1',
    },
  ];
}
