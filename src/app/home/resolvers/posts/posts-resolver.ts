import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { RedditListing, RedditPost } from '@app/core/models';
import { Reddit } from '@app/core/services';

export const postsResolver: ResolveFn<RedditListing<RedditPost>> = () => {
  return inject(Reddit).getPosts('popular', 'hot', 10);
};
