import { TestBed } from '@angular/core/testing';

import { AlertServic } from './alert-servic';

describe('AlertServic', () => {
  let service: AlertServic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertServic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
