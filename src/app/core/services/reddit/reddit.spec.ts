import { TestBed } from '@angular/core/testing';

import { Reddit } from './reddit';

describe('Reddit', () => {
  let service: Reddit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reddit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
