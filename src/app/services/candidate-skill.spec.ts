import { TestBed } from '@angular/core/testing';

import { CandidateSkill } from './candidate-skill';

describe('CandidateSkill', () => {
  let service: CandidateSkill;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateSkill);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
