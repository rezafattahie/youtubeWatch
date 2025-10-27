import { isPlatformBrowser } from '@angular/common';
import { Component, effect, Inject, input, OnInit, PLATFORM_ID } from '@angular/core';
import { ILink } from '../../models/link.model';
import { PlayerStore } from '../../services/player-store';

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
  private intervalId?: any;
  youtubeId: string | null = null;
  private isYTReady = false;
  selectedVideo = input<ILink>({
    title: '',
    youtubeId: 'TDRNIkVE4bw',
    __class: '',
    group: 'easygerman',
    objectId: '',
    ownerId: '',
    updated: '',
    viewer:'',
    subtitle: [{ subtitle: 'n', start: 0 }],
    sentOn: '',
  });

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,
    private playerStore: PlayerStore
  ) {
    effect(() => {
      const address = this.selectedVideo().youtubeId;
      if (address && isPlatformBrowser(this.platformId) && this.isYTReady) {
        this.setVideoAddress();
      }
    });

    // set youyube API in Browser
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
    }

    // when API has got redy
    (window as any).onYouTubeIframeAPIReady = () => {
      this.isYTReady = true;
      this.setVideoAddress();
    };

    effect(() => {
      const address = this.selectedVideo().youtubeId;
      if (address && isPlatformBrowser(this.platformId) && this.isYTReady) {
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

    if (this.player && window.YT) {
      this.player.loadVideoById(this.youtubeId);
      return;
    }

    // wait until API completely loaded
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
    } else {
      this.clearTimer();
      this.playerStore.isPlaying.set(false);
    }
  }

  onStartVideo() {
    this.playerStore.isPlaying.set(true);

    this.clearTimer();
    this.intervalId = setInterval(() => {
      if (this.player?.getCurrentTime) {
        this.playerStore.currentTime.set(this.player.getCurrentTime());
      }
    }, 300);
  }

  onStopVideo() {
    this.clearTimer();
    this.playerStore.isPlaying.set(false);
  }

  private clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
