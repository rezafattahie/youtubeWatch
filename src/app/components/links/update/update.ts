import { Component, inject, input, signal } from '@angular/core';
import { ILink, ILink_request } from '../../../models/link.model';
import { Icon } from '../../icon/icon';
import { UtilityService } from '../../../services/utility-service';
import { LinksService } from '../../../services/links-service';
import { _videoLinks } from '../../../signalStorage/videoLinks.signal';

@Component({
  selector: 'app-update',
  imports: [Icon],
  templateUrl: './update.html',
  styleUrl: './update.scss',
})
export class Update {
  utilityservice = inject(UtilityService);
  linkService = inject(LinksService);

  link = input.required<ILink>();
  UpdateWhere = input<string>();
  isSyncing = signal<boolean>(false);

  update() {
    if (this.link() && this.link()?.youtubeId) {
      this.isSyncing.set(true);
      this.utilityservice.getVideoInfo(this.link()?.youtubeId).subscribe({
        next: (result) => {
          const updateValue: ILink_request = {
            title: result.title,
          };
          this.linkService.editLinks(this.link().objectId!, updateValue).subscribe({
            next: (res) => {
              const updatedLink: ILink = {
                group: this.link().group,
                sentOn: this.link().sentOn,
                subGroup: this.link().subGroup,
                subtitle: this.link().subtitle,
                title: result.title,
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
          alert('Video details not found!');
          this.isSyncing.set(false);
        },
      });
    } else return;
  }
}
