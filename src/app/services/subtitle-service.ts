import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  http = inject(HttpClient);

  getSubtitle(youtubeId: string): Observable<{ subtitle: { subtitle: string; start: number }[] }> {
    const url = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${youtubeId}&lang=de`;
    const headers = new HttpHeaders({
      'x-rapidapi-key': '428bd76a0fmsh2c63e049d1f2a6bp1b384bjsn14eb9afe177a',
      'x-rapidapi-host': 'youtube-transcriptor.p.rapidapi.com',
    });
    return this.http
      .get<
        {
          title: string;
          description: string;
          transcription: { start: number; dur: number; subtitle?: string }[];
        }[]
      >(url, { headers })
      .pipe(
        map((result) => {
          const item = Array.isArray(result) ? result[0] : result;

          const subtitles =
            item?.transcription?.map((t) => ({
              start: t.start,
              subtitle: t.subtitle ?? '',
            })) ?? [];

          return { subtitle: subtitles };
        })
      );
  }
}
