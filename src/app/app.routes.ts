import { Routes } from '@angular/router';
import { Notfound } from './components/notfound/notfound';
import { Player } from './components/player/player';

export const routes: Routes = [
  {
    path: '',
    component: Player,
    children: [
      { path: '', redirectTo: 'easygerman', pathMatch: 'full' },
      { path: 'easygerman', component: Player },
      { path: 'news', component: Player },
      { path: 'films', component: Player },
      { path: 'grammars', component: Player },
      { path: 'others', component: Player },

    ],
  },
  { path: '**', component: Notfound },
];
