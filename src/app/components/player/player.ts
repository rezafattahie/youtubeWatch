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

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

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
    youtubeId: 'TDRNIkVE4bw',
    __class: '',
    group: 'easygerman',
    objectId: '',
    ownerId: 0,
    updated: '',
    subtitle: [{ subtitle: 'n', start: 0 }],
    sentOn: '',
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {
    // بارگذاری API یوتیوب در مرورگر
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      // وقتی API آماده شد
      (window as any).onYouTubeIframeAPIReady = () => {
        this.setVideoAddress();
      };
    }

    // هر وقت ویدیو تغییر کرد
    effect(() => {
      const address = this.selectedVideo().youtubeId;
      if (address && isPlatformBrowser(this.platformId)) {
        this.setVideoAddress();
      }
    });
  }

  ngOnInit(): void {}

  setVideoAddress() {
    const videoId = this.selectedVideo().youtubeId;
    if (!videoId) {
      console.error('❌ Invalid YouTube link:', this.selectedVideo().youtubeId);
      return;
    }

    this.youtubeId = videoId;

    // اگه پلیر وجود داره، فقط ویدیو جدید رو بارگذاری کن
    if (this.player && window.YT) {
      this.player.loadVideoById(this.youtubeId);
      return;
    }

    // صبر کن تا API واقعاً لود بشه
    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT);
        this.player = new window.YT.Player('yt-player', {
          videoId: this.youtubeId,
          events: {
            onReady: (event: any) => {
              console.log('✅ YouTube Player Ready');
              event.target.playVideo();
            },
            onStateChange: this.onPlayerStateChange.bind(this),
          },
        });
      }
    }, 300);
  }

  onPlayerStateChange(event: any) {
    if (event.data === window.YT.PlayerState.PLAYING) {
      this.onStartVideo();
    } else if (event.data === window.YT.PlayerState.ENDED) {
      this.onStopVideo();
    }
  }

  onStartVideo() {}

  onStopVideo() {}
}
