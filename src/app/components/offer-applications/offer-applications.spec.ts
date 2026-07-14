import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferApplications } from './offer-applications';

describe('OfferApplications', () => {
  let component: OfferApplications;
  let fixture: ComponentFixture<OfferApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferApplications],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferApplications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
