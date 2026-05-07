import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularCommunities } from './popular-communities';

describe('PopularCommunities', () => {
  let component: PopularCommunities;
  let fixture: ComponentFixture<PopularCommunities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularCommunities],
    }).compileComponents();

    fixture = TestBed.createComponent(PopularCommunities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
