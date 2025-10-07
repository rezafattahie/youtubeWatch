import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerForm } from './drawer-form';

describe('DrawerForm', () => {
  let component: DrawerForm;
  let fixture: ComponentFixture<DrawerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
