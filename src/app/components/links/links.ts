import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { Icon } from '../icon/icon';
import { Groups } from '../../models/group.model';
import { _videoLinks, videoLinks } from '../../signalStorage/videoLinks.signal';
import { LinksService } from '../../services/links-service';
import { ILink } from '../../models/link.model';
import { DatePipe } from '@angular/common';
import { IForm } from '../../models/forms.model';
import { Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MoveTo } from './move-to/move-to';
import { DrawerForm } from '../drawer-form/drawer-form';
import { SubtitleService } from '../../services/subtitle-service';
import { concatMap, map } from 'rxjs';

@Component({
  selector: 'app-links',
  imports: [Icon, DrawerForm, DatePipe, RouterLink, MoveTo],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  private linkService = inject(LinksService);
  private subtitleService = inject(SubtitleService);
  @Output() selectedVideo: EventEmitter<ILink> = new EventEmitter();
  moveTo = signal<{ group: string; subGroup?: string }>({ group: '', subGroup: '' });
  activeLinkId = signal<string>('');
  activeType = input<Groups>('easygerman');
  groups = input<{ group: string; subGroups: string[] }[]>([]);
  selectedFormField: { source: string; fields: IForm[] } = { source: '', fields: [] };
  selectedSubGroup = signal<string>('');
  videoLinks = videoLinks;
  filteredVideoLinks = computed(() => {
    const subGroup = this.selectedSubGroup();
    if (!subGroup) return videoLinks();
    return videoLinks().filter((link) => link.subGroup === subGroup);
  });
  newLinkFormfields: IForm[] = [];
  searchFormFields: IForm[] = [];
  openGroups = new Set<string>();

  constructor() {
    effect(() => {
      this.setDrawerFields();
      this.getLinks();
    });
  }

  getLinks() {
    _videoLinks.set([]);
    this.onSelectSubGroup('');
    this.selectedFormField.fields = [];
    const params = {
      pageSize: 100,
      offset: 0,
      where: `group = '${this.activeType()}'`,
    };

    this.linkService.getLinks(params).subscribe({
      next: (result) => {
        if (result) {
          _videoLinks.set(result);
        }
      },
    });
  }

  onSelectVideo(link: ILink) {
    this.selectedVideo.emit(link);
  }

  handleFormSubmit(data: any) {
    if (this.selectedFormField.fields === this.newLinkFormfields) {
      const body: ILink = {
        title: data.title,
        group: this.activeType(),
        youtubeId: this.extractVideoId(data.youtubeId) ?? '',
        sentOn: data.sentOn,
        subGroup: data.subGroup ?? null,
        subtitle: [{ subtitle: '', start: 0 }],
      };

      this.subtitleService
        .getSubtitle(body.youtubeId)
        .pipe(
          map((subtitle) => {
            body.subtitle = subtitle.subtitle;
            return body;
          }),
          concatMap((updatedBody) => this.linkService.addLinks(updatedBody))
        )
        .subscribe({
          next: (res) => _videoLinks.update((current) => [...current, res]),
          error: (err) => alert(err?.error?.message || err),
        });
    }
  }

  setDrawerFields() {
    this.searchFormFields = [];
    this.newLinkFormfields = [];
    this.selectedFormField.fields = [];
    this.searchFormFields = [
      {
        name: 'search',
        label: '',
        type: 'text',
        placeholder: 'Search title, url or date...',
        iconConfig: { name: 'search', class: 'w-5 text-gray-400' },
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
        validators:
          this.activeType() === 'films' || this.activeType() === 'grammars'
            ? [Validators.required]
            : [],
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
    ];
  }

  onSelectSubGroup(subGroup: string) {
    this.selectedSubGroup.set(subGroup);
  }

  onLinkMoveTo(moveTo: { group: string; subGroup: string }, linkeId: string) {
    this.moveTo.set(moveTo);
  }
  onMoveIconClick(linkId: string) {
    this.openGroups.clear();
    this.activeLinkId.set(linkId);
    this.selectedFormField.source = 'moveto';
    this.selectedFormField.fields = [];
  }

  onDrawerClosed() {
    console.log('DrawerClosed');
  }

  //get videoId from youtube URL
  extractVideoId(url: string): string | null {
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  toggleGroup(groupName: string) {
    if (this.openGroups.has(groupName)) {
      this.openGroups.delete(groupName);
    } else {
      this.openGroups.add(groupName);
    }
  }

  isGroupOpen(groupName: string): boolean {
    return this.openGroups.has(groupName);
  }
}
