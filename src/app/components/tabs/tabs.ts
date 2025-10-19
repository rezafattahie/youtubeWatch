import { Component, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ITabInfo } from '../../models/tabInfo.model';
import { Links } from '../links/links';
import { Groups } from '../../models/group.model';
import { ILink } from '../../models/link.model';
import { Player } from '../player/player';
import { Wordbook } from '../wordbook/wordbook';
import { Icon } from '../icon/icon';
import { TabsService } from '../../services/tabs-service';
import { Subtitle } from '../subtitle/subtitle';

@Component({
  selector: 'app-tabs',
  imports: [NgClass, RouterModule, Links, Player, Wordbook, Icon, Subtitle],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs implements OnInit {
  tabService = inject(TabsService);
  @Input() tabs: ITabInfo[] = [];
  groups: { group: string; subGroups: string[] }[] = [];
  @Input() activeType!: Groups;
  addeword = false;
  newWordToWordbook: { word: string; meaning: string; line: string } = {
    word: '',
    line: '',
    meaning: '',
  };
  selectedVideo: ILink = {
    title: '',
    youtubeId: '',
    __class: '',
    group: 'easygerman',
    objectId: '',
    ownerId: 0,
    updated: '',
    sentOn: '',
    subtitle:[{ subtitle: '', start: 0}]
  };

  ngOnInit(): void {
    this.getTabs();
  }

  getTabs() {
    const params = {
      pageSize: 100,
      offset: 0,
    };
    this.tabService.getTabs(params).subscribe({
      next: (result) => {
        result.map((res) => this.groups.push({ group: res.group, subGroups: res.subGroups }));
      },
    });
    console.log('%csrcappcomponents\tabs\tabs.ts:50 this.groups', 'color: #007acc;', this.groups);
  }

  toggleTab(type: Groups) {
    this.activeType = type;
  }

  onGetvideo(event: ILink) {
    this.selectedVideo = event;
  }

  onSendToWordbook(recivedWord: { word: string; meaning: string; line: string }) {
    this.newWordToWordbook = recivedWord;
  }
}
