import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJobOffers } from './my-job-offers';

describe('MyJobOffers', () => {
  let component: MyJobOffers;
  let fixture: ComponentFixture<MyJobOffers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyJobOffers],
    }).compileComponents();

    fixture = TestBed.createComponent(MyJobOffers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
