import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { LoginService } from '../../services/login-service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginService = inject(LoginService);
  loginMode: 'Login' | 'Create' = 'Login';
  loginForm!: FormGroup;

  constructor() {
    this.toggleMode('Login');
  }

  toggleMode(mode: 'Create' | 'Login') {
    this.loginForm = new FormGroup({});
    this.loginMode = mode;
    if ((mode = 'Login')) {
      // this.fb.group({
      //   username: ['', [Validators.required, Validators.minLength(3)]],
      // });
      this.loginForm = new FormGroup({
        username: new FormControl(),
        email: new FormControl(),
        stayLogin: new FormControl(),
      });
    }
    //  else {
    //   this.loginForm = new FormGroup({
    //   });
    // }
  }

  onSubmitForm() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const email = this.loginForm.value.email ?? '';
      if (this.loginMode === 'Login') {
        console.log('%csrcappcomponentsloginlogin.ts:41 username', 'color: #007acc;', username);
        // GET USER
      } else {
        console.log(
          '%csrcappcomponentsloginlogin.ts:43 username , email',
          'color: #007acc;',
          username,
          email
        );
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
