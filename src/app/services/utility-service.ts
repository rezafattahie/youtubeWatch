import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Backendless from 'backendless';
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

  sendEmail(
    templateEmail: string,
    envelope: {
      addresses: string[];
      query: string;
      cc: string[];
      bcc: string[];
      from: string;
      replyTo: string[];
    },
    variables?: {}
  ) {
    const env = new Backendless.EmailEnvelope({
      addresses: envelope.addresses,
      query: envelope.query,
      cc: envelope.cc,
      bcc: envelope.bcc,
      from: envelope.from,
      replyTo: envelope.replyTo,
    });
    Backendless.Messaging.sendEmailFromTemplate(templateEmail, env, variables);
  }
}
