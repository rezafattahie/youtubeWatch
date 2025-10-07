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

@Component({
  selector: 'app-links',
  imports: [Icon, DrawerForm, DatePipe, NgClass],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  private linkService = inject(LinksService);
  @Output() selectedVideo: EventEmitter<ILink> = new EventEmitter();
  activeType = input<Groups>('EasyGerman');
  selectedFormField: IForm[] = [];
  videoLinks = videoLinks;
  newLinkFormfields: IForm[] = [
    { name: 'title', label: 'Title', type: 'text', validators: [Validators.required] },
    {
      name: 'address',
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
      name: 'hasSubtitle',
      label: 'Download subtitle',
      type: 'checkbox',
    },
  ];
  searchFormFields: IForm[] = [
    {
      name: 'search',
      label: 'Search name, address or date',
      type: 'text',
      validators: [Validators.required],
    },
  ];

  constructor() {
    effect(() => {
      this.getLinks();
    });
  }

  getLinks() {
    _videoLinks.set([]);
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
    if (this.selectedFormField === this.newLinkFormfields) {
      const body: ILink = {
        title: data.title,
        group: this.activeType(),
        address: data.address,
        sentOn: data.sentOn,
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

  onDrawerClosed() {
    console.log('DrawerClosed');
  }
}
