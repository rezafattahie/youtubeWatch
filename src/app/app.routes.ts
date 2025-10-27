import { Routes } from '@angular/router';
import { Notfound } from './components/notfound/notfound';
import { Player } from './components/player/player';
import { Login } from './components/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Login,
    children: [
      { path: '', redirectTo: 'Login', pathMatch: 'full' },
      { path: 'Login', component: Login },
      { path: 'easygerman', component: Player },
      { path: 'news', component: Player },
      { path: 'films', component: Player },
      { path: 'grammars', component: Player },
      { path: ':currentMember', component: Player },

    ],
  },
  { path: '**', component: Notfound },
];
