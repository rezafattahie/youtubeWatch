import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { Icon } from '../icon/icon';
import { Groups } from '../../models/group.model';
import { _videoLinks, videoLinks } from '../../signalStorage/videoLinks.signal';
import { LinksService } from '../../services/links-service';
import { ILink } from '../../models/link.model';
import { DatePipe, NgClass } from '@angular/common';
import { DrawerForm } from '../drawer-form/drawer-form';
import { IForm } from '../../models/forms.model';
import { Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-links',
  imports: [Icon, DrawerForm, DatePipe, NgClass, RouterLink],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  private linkService = inject(LinksService);
  @Output() selectedVideo: EventEmitter<ILink> = new EventEmitter();
  activeType = input<Groups>('easygerman');
  selectedFormField: IForm[] = [];
  selectedSubGroup = '';
  videoLinks = videoLinks;
  filteredVideoLinks: ILink[] = [];
  subGroups: string[] = [];
  newLinkFormfields: IForm[] = [];
  searchFormFields: IForm[] = [];

  constructor() {
    effect(() => {
      this.setDrawerFields();
      this.getLinks();
    });
  }

  getLinks() {
    _videoLinks.set([]);
    this.subGroups = [];
    const params = {
      pageSize: 100,
      offset: 0,
      where: `group = '${this.activeType()}'`,
    };

    this.linkService.getLinks(params).subscribe({
      next: (result) => {
        if (result) {
          result.forEach((res) => {
            if (res.subGroup && !this.subGroups.includes(res.subGroup)) {
              this.subGroups.push(res.subGroup);
            }
          });
          _videoLinks.set(result);
          this.filteredVideoLinks = [...videoLinks()];
        }
      },
    });
  }

  onSelectVideo(link: ILink) {
    this.selectedVideo.emit(link);
  }

  handleFormSubmit(data: any) {
    if (this.selectedFormField === this.newLinkFormfields) {
      const body: ILink = {
        title: data.title,
        group: this.activeType(),
        youtubeId: this.extractVideoId(data.youtubeId) ?? '',
        sentOn: data.sentOn,
        subGroup: data.subGroup ?? null,
        subtitle: data.hasSubtitle,
      };

      this.linkService.addLinks(body).subscribe({
        next: (res) => {
          _videoLinks.update((current) => [...current, res]);
        },
        error: (err) => alert(err?.error?.message || err),
      });
    }
  }
  //get videoId from youtube URL
  extractVideoId(url: string): string | null {
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  setDrawerFields() {
    this.searchFormFields = [];
    this.selectedFormField = [];
    this.searchFormFields = [
      {
        name: 'search',
        label: 'Search name, address or date',
        type: 'text',
        validators: [Validators.required],
      },
    ];

    this.newLinkFormfields = [
      { name: 'title', label: 'Title', type: 'text', validators: [Validators.required] },
      {
        name: 'youtubeId',
        label: 'Youtube Address',
        type: 'text',
        validators: [
          Validators.required,
          Validators.pattern(
            // youtube validator
            /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w\-]{11}($|&|\?)/
          ),
        ],
      },
      {
        name: 'sentOn',
        label: `Sent on (e.g Feb-03-2025/feb-03-2025)`,
        type: 'text',
        mask: 'AAA-00-0000',
        placeholder: 'MMM-DD-YYYY',
        validators: [
          Validators.pattern(
            /^(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']{3})-(\d{2})-(\d{4})$/
          ),
          Validators.required,
        ],
      },
      {
        name: 'subGroup',
        label: this.activeType() === 'films' ? 'Select serie' : 'Select level',
        type: 'select',
        hidden: this.activeType() === 'films' || this.activeType() === 'grammars' ? false : true,
        options:
          this.activeType() === 'films'
            ? [
                { label: 'Heidi', value: 'Heidi', selected: false },
                { label: 'Perin', value: 'Perin', selected: false },
                { label: 'Capitain Tsuba', value: 'Capitain Tsuba', selected: false },
                { label: 'Familie Rabinson', value: 'Familie Robinson', selected: true },
              ]
            : [
                { label: 'A1.1', value: 'A1.1', selected: false },
                { label: 'A1.2', value: 'A1.2', selected: false },
                { label: 'A2.1', value: 'A2.1', selected: false },
                { label: 'A2.2', value: 'A2.2', selected: false },
                { label: 'B1.1', value: 'B1.1', selected: false },
                { label: 'B1.2', value: 'B1.2', selected: false },
                { label: 'B2.1', value: 'B2.1', selected: true },
                { label: 'B2.2', value: 'B2.2', selected: false },
              ],
      },
      {
        name: 'hasSubtitle',
        label: 'Download subtitle',
        type: 'checkbox',
        disabled: true,
        value: false,
      },
    ];
  }

  onSelectSubGroup(subGroup: string) {
    this.selectedSubGroup = subGroup;
    if (subGroup === '') {
      this.filteredVideoLinks = [...this.videoLinks()];
    } else {
      this.filteredVideoLinks = this.videoLinks().filter((video) => video.subGroup === subGroup);
    }
  }
  onDrawerClosed() {
    console.log('DrawerClosed');
  }
}
