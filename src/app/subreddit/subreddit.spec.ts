import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subreddit } from './subreddit';

describe('Subreddit', () => {
  let component: Subreddit;
  let fixture: ComponentFixture<Subreddit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subreddit],
    }).compileComponents();

    fixture = TestBed.createComponent(Subreddit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
