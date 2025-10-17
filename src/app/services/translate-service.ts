import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  http = inject(HttpClient);

  getTranslation(word: string) {
    return this.http.get(
      `https://api-cdn-plus.dioco.io/base_dict_getHoverDict_8?form=${word}&lemma=&sl=de&tl=fa&pos=ADJ&pow=n`
    );
  }
}
