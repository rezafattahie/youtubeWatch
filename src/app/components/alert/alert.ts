import { Component, inject, OnInit, signal } from '@angular/core';
import { Icon } from '../icon/icon';
import { AlertServic } from '../../services/alert-servic';

@Component({
  selector: 'app-alert',
  imports: [Icon],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert implements OnInit {
  alertService = inject(AlertServic);
  isOpen = signal(true);
  message = 'salam in ye texte etsti hast.';

  constructor() {}

  ngOnInit(): void {
    this.setStyle();
  }

  setStyle(): string {
    const status = this.alertService.status();
    let style = '';
    if (status) {
      switch (status) {
        case 'success':
          style = 'bg-lime-100/70 text-lime-700';
          break;
        case 'failed':
          style = 'bg-rose-100/70  text-rose-500';
          break;
        case 'info':
          style = 'bg-violet-100/70  text-violet-500';
          break;
        case 'warning':
          style = 'bg-orange-100/70  text-orange-500';
          break;
      }
    }
    return style;
  }

  close() {
    this.isOpen.set(false);
  }
}
