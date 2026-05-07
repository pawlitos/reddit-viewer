import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { RedditPost, SubredditInfo } from '@app/core/models';
import { Reddit } from '@app/core/services';
import { PopularCommunities } from './popular-communities';
import { PostCard } from './post-card';

@Component({
  selector: 'app-home',
  imports: [PostCard, PopularCommunities],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  private readonly reddit = inject(Reddit);
  private postsSubscription?: Subscription;
  private popularCommunitiesSubscription?: Subscription;

  protected readonly posts = signal<RedditPost[]>([]);
  protected readonly communities = signal<SubredditInfo[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<unknown>(null);
  protected readonly after = signal<string | null>(null);
  protected readonly hasMore = computed(() => this.after() !== null);

  ngOnInit() {
    this.loadPosts();
    this.loadPopularCommunities();
  }

  ngOnDestroy() {
    this.postsSubscription?.unsubscribe();
    this.popularCommunitiesSubscription?.unsubscribe();
  }

  protected loadMore() {
    this.loadPosts();
  }

  private loadPosts() {
    this.isLoading.set(true);
    this.error.set(null);
    this.postsSubscription = this.reddit.getPosts('popular', 'hot', 10, this.after()).subscribe({
      next: (listing) => {
        this.posts.update((prev) => [...prev, ...listing.data.children.map((c) => c.data)]);
        this.after.set(listing.data.after);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err);
        this.isLoading.set(false);
      },
    });
  }

  private loadPopularCommunities() {
    this.popularCommunitiesSubscription = this.reddit.getPopularSubreddits().subscribe({
      next: (listing) => {
        this.communities.set(listing.data.children.map((c) => c.data));
      },
    });
  }
}
