import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { ILink } from '../models/link.model';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private api = inject(ApiService);

  getLinks(params?: any): Observable<ILink[]> {
    return this.api.get<ILink[]>('videoLinks', params);
  }

  addLinks(links: ILink): Observable<any> {
    return this.api.post('videoLinks', links);
  }
}
