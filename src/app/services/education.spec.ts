import { TestBed } from '@angular/core/testing';

import { Education } from './education';

describe('Education', () => {
  let service: Education;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Education);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
