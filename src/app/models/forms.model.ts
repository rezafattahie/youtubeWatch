import { ValidatorFn } from '@angular/forms';

export interface IForm {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'date';
  options?: { label: string; value: any; selected: boolean }[]; // for select
  validators?: ValidatorFn[];
  mask?: string;
  placeholder?: string;
  value?: any;
  disabled?: boolean;
  hidden?: boolean;
  iconConfig?: { name: string; class: string };
}
