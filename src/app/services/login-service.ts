import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api';
import { IUser } from '../models/user.model';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { IFeedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  api = inject(ApiService);
  router = inject(Router);
  loggedinMember = signal<string>('');

  login(user: string): Observable<IUser | null> {
    const params = {
      where: `name = '${user}'`,
    };
    return this.api.get<IUser[]>('members', params).pipe(
      map((users) => {
        // پیدا کردن دقیقاً همون یوزرنیم (case-sensitive)
        const exactMatch = users.find((u) => u.name === user);
        return exactMatch ?? null;
      })
    );
  }

  createAccount(user: IUser): Observable<IUser> {
    const params = {
      name: user.name,
      email: user.email ?? null,
    };

    return this.api.post('members', params);
  }

  logout() {
    const exist = localStorage.getItem(this.loggedinMember());
    if (exist) {
      const data = JSON.parse(exist);
      data.stayLogin = false;
      localStorage.setItem(this.loggedinMember(), JSON.stringify(data));
    }
    this.router.navigate(['']);
    this.loggedinMember.set('');
  }

  sendFeedback(params?: IFeedback): Observable<IFeedback> {
    return this.api.post('feedbacks', params);
  }
  getFeedbacks(params?: IFeedback): Observable<IFeedback[]> {
    return this.api.get<IFeedback[]>('feedbacks', params);
  }
}
