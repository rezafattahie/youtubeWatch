import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveTo } from './move-to';

describe('MoveTo', () => {
  let component: MoveTo;
  let fixture: ComponentFixture<MoveTo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveTo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveTo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
