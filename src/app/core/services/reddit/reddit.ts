import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { FeedSort, RedditListing, RedditPost, SubredditInfo, TopTime } from '@app/core/models';

@Injectable({
  providedIn: 'root',
})
export class Reddit {
  private readonly http = inject(HttpClient);

  getPosts(
    subreddit: string,
    sort: FeedSort = 'hot',
    limit: number = 25,
    after?: string | null,
    time?: TopTime | null,
  ) {
    let params = new HttpParams();

    params = params.set('limit', limit);
    if (after) params = params.set('after', after);
    if (sort === 'top' && time) params = params.set('t', time);
    params = params.set('raw_json', '1');

    return this.http.get<RedditListing<RedditPost>>(`/r/${subreddit}/${sort}.json`, { params });
  }

  getPopularSubreddits() {
    let params = new HttpParams();

    params = params.set('limit', 20);
    params = params.set('raw_json', '1');

    return this.http.get<RedditListing<SubredditInfo>>('/subreddits/popular.json', { params });
  }
}
