import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISubtitle } from '../models/subtitle.mode';

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  http = inject(HttpClient);

  getSubtitle(youtubeId: string): Observable<{ subtitle: ISubtitle[] }> {
    const url = `https://youtube-transcript-generator2.p.rapidapi.com/transcript?v=${youtubeId}`;
    const headers = new HttpHeaders({
      'x-rapidapi-key': '428bd76a0fmsh2c63e049d1f2a6bp1b384bjsn14eb9afe177a',
      'x-rapidapi-host': 'youtube-transcript-generator2.p.rapidapi.com',
    });

    return this.http
      .get<{
        count: number;
        segments: { text: string; timestamp: string }[];
      }>(url, { headers })
      .pipe(
        map((result) => {
          const subtitles =
            result?.segments?.map((s) => ({
              start: this.parseTimestampToSeconds(s.timestamp, ':'),
              subtitle: s.text ?? '',
            })) ?? [];

          return { subtitle: subtitles };
        })
      );
  }

  getSubtitle2(youtubeId: string): Observable<{ subtitle: ISubtitle[] }> {
    const url = `https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${youtubeId}`;
    const headers = new HttpHeaders({
      'x-rapidapi-key': '428bd76a0fmsh2c63e049d1f2a6bp1b384bjsn14eb9afe177a',
      'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com',
    });

    return this.http
      .get<{
        success: boolean;
        transcript: { text: string; duration: string; offset: string; lang: string }[];
      }>(url, { headers })
      .pipe(
        map((result) => {
          const subtitles =
            result?.transcript?.map((s) => ({
              start: +s.offset,
              subtitle: s.text ?? '',
            })) ?? [];

          return { subtitle: subtitles };
        })
      );
  }

  parseTimestampToSeconds(timestamp: string, separator: string): number {
    const [hours, minutes, seconds] = timestamp.split(separator).map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  }
}
