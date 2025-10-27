import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  api = inject(ApiService);
  getTabs(params?: any): Observable<{ group: string; subGroups: string[]; label: string }[]> {
    return this.api.get<{ group: string; subGroups: string[]; label: string }[]>('groups', params);
  }
}
