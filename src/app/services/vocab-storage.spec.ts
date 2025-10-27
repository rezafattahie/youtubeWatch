import { TestBed } from '@angular/core/testing';

import { VocabStorage } from './vocab-storage';

describe('VocabStorage', () => {
  let service: VocabStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
