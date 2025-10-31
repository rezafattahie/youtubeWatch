import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { ILink, ILink_request } from '../models/link.model';
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

  editLinks(objectId: string, newValue: ILink_request): Observable<ILink[]> {
    const params = {
      where: `objectId = '${objectId}'`,
    };
    return this.api.put('bulk/videoLinks', newValue, params);
  }

  deleteLink(body?: any): Observable<ILink[]> {
    return this.api.delete('videoLinks', body);
  }

  moveLink(
    objectId: string,
    newLocation: { group: string; subGroup?: string;}
  ): Observable<any> {
    return this.api.put(`videoLinks/${objectId}`, {
      group: newLocation.group,
      subGroup: newLocation.subGroup ?? null,
      viewer: 'all',
    });
  }
}
