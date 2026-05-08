import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { RedditListing, RedditPost } from '@app/core/models';
import { postsResolver } from './posts-resolver';

describe('postsResolver', () => {
  const executeResolver: ResolveFn<RedditListing<RedditPost>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => postsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
