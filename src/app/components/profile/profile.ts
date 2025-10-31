import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { DrawerForm } from '../drawer-form/drawer-form';
import { LoginService } from '../../services/login-service';
import { Icon } from '../icon/icon';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { IFeedback } from '../../models/feedback.model';
import { IForm } from '../../models/forms.model';
import { AlertServic } from '../../services/alert-servic';

@Component({
  selector: 'app-profile',
  imports: [DrawerForm, Icon, NgClass, FormsModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  loginService = inject(LoginService);
  private alertService = inject(AlertServic);
  @ViewChild('alertDrawer') alertDrawer!: DrawerForm;
  feedbacks = signal<IFeedback[]>([]);
  userFavoriteMode = signal<'youtube' | 'text' | null>(null);
  feedbackFormFields: IForm[] = [
    {
      name: 'feedback',
      label: 'Issue',
      type: 'textarea',
      placeholder: 'Found a bug?',
      validators: [Validators.required],
    },
  ];

  constructor() {
    effect(() => {
      this.onGetFeedbacks();
    });
    this.getFavoriteMode();
  }

  setFavoriteMode(mode: 'youtube' | 'text') {
    this.userFavoriteMode.set(mode);
    const exist = localStorage.getItem(this.loginService.loggedinMember());
    if (exist) {
      const data = JSON.parse(exist);
      data.mode = mode;
      localStorage.setItem(this.loginService.loggedinMember(), JSON.stringify(data));
    } else {
      localStorage.setItem(
        this.loginService.loggedinMember(),
        JSON.stringify({ stayLogin: false, mode: 'youtube' })
      );
    }
  }

  getFavoriteMode() {
    const mode = JSON.parse(localStorage.getItem(this.loginService.loggedinMember())!) ?? {
      mode: 'youtube',
    };
    if (mode.mode) {
      this.userFavoriteMode.set(mode.mode);
    }
  }

  onSendReport(data: any) {
    const params: IFeedback = {
      from: this.loginService.loggedinMember(),
      text: data.feedback,
    };
    this.loginService.sendFeedback(params).subscribe({
      next: () => {
        this.alertService.show({
          status: 'info',
          message: [
            `Dear ${this.loginService.loggedinMember()}!`,
            'Thanks for your feedback! We’ll respond to you as soon as possible.',
          ],
          isOpen: true,
        });
      },
      error: (err) => {
        this.alertService.show({
          status: 'failed',
          message: [err.message],
          isOpen: true,
        });
      },
    });
  }

  onGetFeedbacks() {
    if (this.loginService.loggedinMember() === 'Admin') {
      this.loginService.getFeedbacks().subscribe({
        next: (res) => {
          this.feedbacks.set(res);
          const HasNotRead = this.feedbacks().find((fb) => !fb.respond);
          HasNotRead && this.alertDrawer.open();
        },
        error: (err) => {
          this.alertService.show({
            status: 'failed',
            message: [err.message],
            isOpen: true,
          });
        },
      });
    }
  }

  logout() {
    this.loginService.logout();
  }
}
