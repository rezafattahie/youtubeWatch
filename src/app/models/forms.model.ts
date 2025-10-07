import { ValidatorFn } from '@angular/forms';

export interface IForm {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox';
  options?: { label: string; value: any }[]; // for select
  validators?: ValidatorFn[];
  mask?: string;
  placeholder?: string;
}
