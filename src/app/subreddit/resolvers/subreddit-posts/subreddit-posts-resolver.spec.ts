import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { RedditListing, RedditPost } from '@app/core/models';
import { subredditPostsResolver } from './subreddit-posts-resolver';

describe('subredditPostsResolver', () => {
  const executeResolver: ResolveFn<RedditListing<RedditPost>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => subredditPostsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
