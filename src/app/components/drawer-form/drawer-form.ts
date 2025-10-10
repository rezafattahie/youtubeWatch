import { Component, EventEmitter, Output, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { IForm } from '../../models/forms.model';

@Component({
  selector: 'app-drawer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask({ dropSpecialCharacters: false })],
  templateUrl: './drawer-form.html',
})
export class DrawerForm {
  fields = input<IForm[]>([]);
  title = input('');
  btnText = input();

  @Output() formSubmit = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  form = signal<FormGroup | null>(null);
  isOpen = signal(false);

  constructor(private fb: FormBuilder) {
    effect(() => {
      const f = this.fields();
      if (f?.length) {
        this.buildForm(f);
      }
    });
  }

  private buildForm(fields: IForm[]) {
    const group: any = {};

    for (const field of fields) {
      group[field.name] = new FormControl(
        { value: field.value ?? '', disabled: field.disabled ?? false },
        field.validators || []
      );
    }

    this.form.set(this.fb.group(group));
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.closed.emit();
  }

  submitForm() {
    const frm = this.form();
    if (frm?.valid) {
      this.formSubmit.emit(frm.getRawValue());
      this.close();
      frm.reset();
    } else {
      frm?.markAllAsTouched();
    }
  }
}
