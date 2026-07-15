import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatePublicProfile } from './candidate-public-profile';

describe('CandidatePublicProfile', () => {
  let component: CandidatePublicProfile;
  let fixture: ComponentFixture<CandidatePublicProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatePublicProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatePublicProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
