import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { LoginService } from '../../services/login-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityService } from '../../services/utility-service';
import { AlertServic } from '../../services/alert-servic';

@Component({
  selector: 'app-login',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginService = inject(LoginService);
  utility = inject(UtilityService);
  alertService = inject(AlertServic);
  router = inject(Router);
  loginMode: 'Login' | 'Join' = 'Login';
  loginForm!: FormGroup;

  constructor() {
    this.toggleMode('Login');
  }

  toggleMode(mode: 'Join' | 'Login') {
    this.loginForm = new FormGroup({});
    this.loginMode = mode;
    if ((mode = 'Login')) {
      this.loginForm = new FormGroup({
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ]),
        email: new FormControl('', [
          Validators.email,
          this.loginMode == 'Join' ? Validators.required : Validators.nullValidator,
        ]),
        stayLogin: new FormControl(false),
      });
    }
  }

  sendEmail(email: string, template: string, options: {}) {
    this.utility.sendEmail(
      template,
      {
        addresses: [email],
        bcc: [],
        cc: [],
        from: 'Reza from WrotHafen',
        query: '',
        replyTo: ['worthafen@app-reza.com'],
      },
      options
    );
  }

  onSubmitForm() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const email = this.loginForm.value.email ?? '';
      const stayLogin = this.loginForm.value.stayLogin;

      if (this.loginMode === 'Login') {
        this.loginService.login(username).subscribe({
          next: (res) => {
            if (res) {
              const exist = localStorage.getItem(username);
              if (exist) {
                const data = JSON.parse(exist);
                data.stayLogin = stayLogin;
                localStorage.setItem(username, JSON.stringify(data));
              } else {
                localStorage.setItem(
                  username,
                  JSON.stringify({ stayLogin: stayLogin, mode: 'youtube' })
                );
              }

              this.loginService.loggedinMember.set(res.name);
              this.router.navigate(['/easygerman']);

              this.sendEmail('rezafatahy@gmail.com', 'user logins', {
                user: res.name,
                date: new Intl.DateTimeFormat('en-EN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date()),
              });
            } else {
              this.alertService.show({
                status: 'failed',
                message: [`User with the name "${username}" was not found.`],
                isOpen: true,
              });
            }
          },
          error: (err) => {
            this.alertService.show({
              status: 'failed',
              message: [err.message],
              isOpen: true,
            });
          },
        });
      } else {
        const user = { name: username, email: email ?? null };
        this.loginService.createAccount(user).subscribe({
          next: (res) => {
            this.loginService.loggedinMember.set(res.name);
            this.alertService.show({
              status: 'info',
              message: [
                `Dear ${res.name}!`,
                'Glad you joined us. We hope you have a great time getting started.',
              ],
              isOpen: true,
            });
            this.router.navigate(['/easygerman']);
            email != null &&
              this.sendEmail(user.email, 'register', {
                identity_name: user.name,
                app_name: 'Wort Hafen',
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
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
