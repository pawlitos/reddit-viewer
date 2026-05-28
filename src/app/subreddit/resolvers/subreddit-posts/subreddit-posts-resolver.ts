import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';

import { RedditListing, RedditPost } from '@app/core/models';
import { Reddit } from '@app/core/services';

export const subredditPostsResolver: ResolveFn<RedditListing<RedditPost>> = (route) => {
  const reddit = inject(Reddit);
  const router = inject(Router);

  return reddit.getPosts(route.paramMap.get('subreddit')!, 'hot', 10).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        router.navigate(['/not-found']);
        return EMPTY;
      }

      return throwError(() => error);
    }),
  );
};
