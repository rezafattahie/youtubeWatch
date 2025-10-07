import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IForm } from '../../models/forms.model';

@Component({
  selector: 'app-drawer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask({ dropSpecialCharacters: false })],
  templateUrl: './drawer-form.html',
})
export class DrawerForm implements OnChanges {
  @Input() fields: IForm[] = [];
  @Input() title = '';
  @Input() btnText = 'Submit';
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  form!: FormGroup;
  isOpen = false;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] && this.fields.length > 0) {
      this.buildForm();
    }
  }

  private buildForm() {
    const group: any = {};
    for (const field of this.fields) {
      group[field.name] = ['', field.validators || []];
    }
    this.form = this.fb.group(group);
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
  }

  submitForm() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      this.close();
    } else {
      this.form.markAllAsTouched();
    }
    this.form.reset();
  }
}
