import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOffersList } from './job-offers-list';

describe('JobOffersList', () => {
  let component: JobOffersList;
  let fixture: ComponentFixture<JobOffersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOffersList],
    }).compileComponents();

    fixture = TestBed.createComponent(JobOffersList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
