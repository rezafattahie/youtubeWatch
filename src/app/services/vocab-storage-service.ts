import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { IVocab } from '../models/vocabstorage.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VocabStorage {
  private api = inject(ApiService);

  saveVocab(params?: any, body?: any): Observable<IVocab> {
    return this.api.put(`vocabstorage?${params}`, body);
  }

  getVocabs(user: string, linkId: string): Observable<IVocab[]> {
    const params = {
      where: `owner = '${user}' and linkId='${linkId}'`,
      pageSize: 100,
      offset: 0,
    };
    return this.api.get<IVocab[]>('vocabstorage', params);
  }
}
