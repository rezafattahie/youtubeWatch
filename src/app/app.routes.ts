import { Routes } from '@angular/router';
import { Notfound } from './components/notfound/notfound';
import { Player } from './components/player/player';

export const routes: Routes = [
  {
    path: '',
    component: Player,
    children: [
      { path: '', redirectTo: 'EasyGerman', pathMatch: 'full' },
      { path: 'EasyGerman', component: Player },
      { path: 'News', component: Player },
      { path: 'Films', component: Player },
      { path: 'Grammars', component: Player },
      { path: 'Others', component: Player },

    ],
  },
  { path: '**', component: Notfound },
];
