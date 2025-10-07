import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  Inject,
  input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ILink } from '../../models/link.model';

declare var YT: any;

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrls: ['./player.scss'],
})
export class Player implements OnInit {
  player?: any;
  youtubeId: string | null = null;

  selectedVideo = input<ILink>({
    title: '',
    address: '',
    __class: '',
    group: 'EasyGerman',
    objectId: '',
    ownerId: 0,
    subtitle: '',
    updated: '',
    sentOn: '',
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (!document.getElementById('youtube-iframe-api')) {
          const tag = document.createElement('script');
          tag.id = 'youtube-iframe-api';
          tag.src = 'https://www.youtube.com/iframe_api';
          document.body.appendChild(tag);
        }

        (window as any).onYouTubeIframeAPIReady = () => {
          this.setVideoAddress();
        };
      }
    });

    // reaction to change selectedVideo
    effect(() => {
      const address = this.selectedVideo().address;
      if (address) {
        this.setVideoAddress();
      }
    });
  }

  ngOnInit(): void {}

  setVideoAddress() {
    const videoId = this.extractVideoId(this.selectedVideo().address);
    if (!videoId) {
      console.error('Invalid YouTube link:', this.selectedVideo().address);
      return;
    }

    this.youtubeId = videoId;

    if (this.player) {
      this.player.loadVideoById(videoId);
    } else {
      this.player = new YT.Player('yt-player', {
        videoId: videoId,
        events: {
          onStateChange: this.onPlayerStateChange.bind(this),
        },
      });
    }
  }

  //get videoId from youtube URL
  extractVideoId(url: string): string | null {
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  onPlayerStateChange(event: any) {
    if (event.data === YT.PlayerState.PLAYING) {
      // this.onStartVideo();
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      // this.onStopVideo();
    }
  }
}
