import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { ILink } from '../models/link.model';
import { Groups } from '../models/group.model';

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

  editLinks(objectId: string, newValue: ILink): Observable<ILink[]> {
    return this.api.put('videoLinks', newValue);
  }

  moveLink(objectId: string, newLocation: { group: string; subGroup?: string }): Observable<any> {
    return this.api.put(`videoLinks/${objectId}`, {
      group: newLocation.group,
      subGroup: newLocation.subGroup ?? null,
    });
  }
}
