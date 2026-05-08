import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { RedditListing, SubredditInfo } from '@app/core/models';
import { Reddit } from '@app/core/services';

export const communitiesResolver: ResolveFn<RedditListing<SubredditInfo>> = () => {
  return inject(Reddit).getPopularSubreddits();
};
