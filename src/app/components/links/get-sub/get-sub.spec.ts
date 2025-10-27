import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSub } from './get-sub';

describe('GetSub', () => {
  let component: GetSub;
  let fixture: ComponentFixture<GetSub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetSub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetSub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
