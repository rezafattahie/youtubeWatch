import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IVideoInfo } from '../models/videoInfo.model';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private http = inject(HttpClient);

  private url = 'https://youtube-video-information1.p.rapidapi.com/api/youtube?video_id=';

  getVideoInfo(youtubeId: string): Observable<IVideoInfo> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': '428bd76a0fmsh2c63e049d1f2a6bp1b384bjsn14eb9afe177a',
      'x-rapidapi-host': 'youtube-video-information1.p.rapidapi.com',
    });

    const url = this.url + youtubeId;
    return this.http.get<IVideoInfo>(url, { headers });
  }
}
