import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ITabInfo } from '../../models/tabInfo.model';
import { Links } from '../links/links';
import { Groups } from '../../models/group.model';
import { ILink } from '../../models/link.model';
import { Player } from '../player/player';
import { Subtitle } from '../subtitle/subtitle';
import { Wordbook } from '../wordbook/wordbook';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-tabs',
  imports: [NgClass, RouterModule, Links, Player, Subtitle, Wordbook, Icon],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {
  @Input() tabs: ITabInfo[] = [];
  @Input() activeType!: Groups;
  addeword = false;
   selectedVideo: ILink = {
    title: '',
    youtubeId: '',
    __class: '',
    group: 'easygerman',
    objectId: '',
    ownerId: 0,
    subtitle: '',
    updated: '',
    sentOn: '',
  };

  toggleTab(type: Groups) {
    this.activeType = type;
  }


  onGetvideo(event: ILink) {
    this.selectedVideo = event;
  }
}
