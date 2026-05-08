import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { RedditListing, SubredditInfo } from '@app/core/models';
import { communitiesResolver } from './communities-resolver';

describe('communitiesResolver', () => {
  const executeResolver: ResolveFn<RedditListing<SubredditInfo>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => communitiesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
