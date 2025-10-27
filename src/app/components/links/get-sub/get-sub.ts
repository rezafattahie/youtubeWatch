import { Component, inject, input, signal } from '@angular/core';
import { Icon } from '../../icon/icon';
import { ILink, ILink_request } from '../../../models/link.model';
import { SubtitleService } from '../../../services/subtitle-service';
import { LinksService } from '../../../services/links-service';
import { _videoLinks } from '../../../signalStorage/videoLinks.signal';

@Component({
  selector: 'app-get-sub',
  imports: [Icon],
  templateUrl: './get-sub.html',
  styleUrl: './get-sub.scss',
})
export class GetSub {
  subtitleService = inject(SubtitleService);
  linkService = inject(LinksService);
  link = input.required<ILink>();
  isSyncing = signal(false);
  getSubtitle() {
    if (this.link() && this.link()?.youtubeId) {
      this.isSyncing.set(true);
      this.subtitleService.getSubtitle2(this.link()?.youtubeId!).subscribe({
        next: (result) => {
          const updateValue: ILink_request = {
            subtitle: result.subtitle,
          };
          this.linkService.editLinks(this.link().objectId!, updateValue).subscribe({
            next: (res) => {
              const updatedLink: ILink = {
                group: this.link().group,
                sentOn: this.link().sentOn,
                subGroup: this.link().subGroup,
                subtitle: result.subtitle,
                title: this.link().title,
                viewer: this.link().viewer,
                youtubeId: this.link().youtubeId,
              };
              _videoLinks.update((current) =>
                current.map((l) => (l.objectId === this.link().objectId ? updatedLink : l))
              );
            },
            error: (err) => {
              alert(err.message);
            },
          });
          this.isSyncing.set(false);
        },
        error: (err) => {
          alert(err.message);
          this.isSyncing.set(false);
        },
      });
    } else return;
  }
}
