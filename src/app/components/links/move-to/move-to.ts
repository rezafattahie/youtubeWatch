import { Component, effect, inject, input } from '@angular/core';
import { LinksService } from '../../../services/links-service';
import { Icon } from '../../icon/icon';
import { _videoLinks } from '../../../signalStorage/videoLinks.signal';
import { AlertServic } from '../../../services/alert-servic';

@Component({
  selector: 'app-move-to',
  imports: [Icon],
  templateUrl: './move-to.html',
  styleUrls: ['./move-to.scss'],
})
export class MoveTo {
  private linkService = inject(LinksService);
  private alertService = inject(AlertServic);

  linkId = input<string>('');
  moveTo = input<{ group: string; subGroup?: string }>({ group: '', subGroup: '' });
  activeLinkId = input<string | null>(null);

  constructor() {
    effect(() => {
      const moveTo = this.moveTo();
      const linkId = this.linkId();
      const active = this.activeLinkId();

      if (moveTo?.group && active === linkId) {
        this.onSelectSubGroup(moveTo);
      }
    });
  }

  onSelectSubGroup(moveTo: { group: string; subGroup?: string }) {
    const id = this.linkId();
    if (!id) return;

    this.linkService
      .moveLink(id, {
        group: moveTo.group,
        subGroup: moveTo.subGroup ?? '',
      })
      .subscribe({
        next: (res) => {
          _videoLinks.update((current) =>
            current.map((l) => (l.objectId === res.objectId ? res : l))
          );
        },
        error: (err) =>
          this.alertService.show({
            status: 'failed',
            message: [err.message],
            isOpen: true,
          }),
      });
  }
}
