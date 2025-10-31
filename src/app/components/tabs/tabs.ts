import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ITabInfo } from '../../models/tabInfo.model';
import { Links } from '../links/links';
import { Groups } from '../../models/group.model';
import { ILink } from '../../models/link.model';
import { Player } from '../player/player';
import { Icon } from '../icon/icon';
import { TabsService } from '../../services/tabs-service';
import { Subtitle } from '../subtitle/subtitle';
import { LoginService } from '../../services/login-service';
import { Profile } from '../profile/profile';
import { IVocab } from '../../models/vocabstorage.model';
import { Wordbook } from '../wordbook/wordbook';
import { AlertServic } from '../../services/alert-servic';

@Component({
  selector: 'app-tabs',
  imports: [NgClass, RouterModule, Links, Player, Icon, Subtitle, Profile, Wordbook],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {
  private tabService = inject(TabsService);
  private loginService = inject(LoginService);
  private alertService = inject(AlertServic);
  tabs = input<ITabInfo[]>([]);
  currentLinkId = signal<string>('');
  groups: { group: string; subGroups: string[]; label: string }[] = [];
  @Input() activeType!: Groups;
  addeword = false;
  newWordToWordbook!: IVocab;
  selectedVideo: ILink = {
    title: '',
    youtubeId: '',
    __class: '',
    group: 'easygerman',
    objectId: '',
    ownerId: '',
    updated: '',
    sentOn: '',
    viewer: 'all',
    subtitle: [{ subtitle: '', start: 0 }],
  };

  constructor() {
    effect(() => {
      this.tabs().map((tab, index) => {
        if (tab.type === 'others') this.tabs()[index].label = this.loginService.loggedinMember();
      });
    });

    this.getTabs();
  }

  getTabs() {
    const params = {
      pageSize: 100,
      offset: 0,
    };
    this.tabService.getTabs(params).subscribe({
      next: (result) => {
        result.map((res) =>
          this.groups.push({ group: res.group, subGroups: res.subGroups, label: res.label })
        );
      },
      error: (err) => {
        this.alertService.show({
          status: 'failed',
          message: [err.message],
          isOpen: true,
        });
      },
    });
  }

  toggleTab(type: Groups) {
    this.activeType = type;
  }

  onGetvideo(event: ILink) {
    this.newWordToWordbook = {
      linkId: this.selectedVideo.objectId ?? '',
      owner: this.loginService.loggedinMember(),
      words: [],
    };
    this.selectedVideo = event;
  }

  onGetCurrentLink(linkId: string) {
    this.currentLinkId.set(linkId);
  }

  onSendToWordbook(recivedWord: IVocab) {
    this.newWordToWordbook = recivedWord;
  }
}
