import { Component, inject, signal, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';

import { LoginService } from '../../services/login-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DrawerForm } from '../drawer-form/drawer-form';

@Component({
  selector: 'app-login',
  imports: [NgClass, ReactiveFormsModule, DrawerForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginService = inject(LoginService);
  router = inject(Router);
  @ViewChild('alertMessage') alertMessage!: DrawerForm;
  alert = signal<{ status: 'success' | 'failed'; text: string } | null>(null);
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
        username: new FormControl(),
        email: new FormControl(),
        stayLogin: new FormControl(),
      });
    }
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
            } else {
              this.alert.set({ status: 'failed', text: `user "${username}" not found` });
              this.alertMessage.open();
            }
          },
          error: (err) => {
            this.alert.set({ status: 'failed', text: err.message });
            this.alertMessage.open();
          },
        });
      } else {
        const user = { name: username, email: email ?? null };
        this.loginService.createAccount(user).subscribe({
          next: (res) => {
            this.loginService.loggedinMember.set(res.name);
            this.router.navigate(['/easygerman']);
          },
          error: (err) => {
            if (err.code == 1406)
              this.alert.set({ status: 'failed', text: 'Maximum Character: 15' });
            this.alertMessage.open();
          },
        });
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
