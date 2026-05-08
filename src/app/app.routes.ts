import { Routes } from '@angular/router';

import { communitiesResolver, postsResolver } from './home/resolvers';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
    resolve: { posts: postsResolver, communities: communitiesResolver },
  },
  {
    path: 'r/:subreddit',
    loadComponent: () => import('./subreddit/subreddit').then((m) => m.Subreddit),
  },
];
