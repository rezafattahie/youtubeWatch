import { Component, inject, OnInit, signal } from '@angular/core';
import { Icon } from '../icon/icon';
import { AlertServic } from '../../services/alert-servic';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-alert',
  imports: [Icon],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert implements OnInit {
  alertService = inject(AlertServic);
  isOpen = signal(false);
  messages = ['salam in ye texte etsti hast'];

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
          style = 'bg-emerald-50 text-emerald-500';
          break;
        case 'failed':
          style = 'bg-rose-50 text-rose-500';
          break;
        case 'info':
          style = 'bg-violet-50 text-violet-500';
          break;
        case 'warning':
          style = 'bg-orange-50 text-orange-500';
          break;
      }
    }
    return style;
  }

  close() {
    this.isOpen.set(false);
  }
}
