import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wordbook } from './wordbook';

describe('Wordbook', () => {
  let component: Wordbook;
  let fixture: ComponentFixture<Wordbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wordbook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Wordbook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
