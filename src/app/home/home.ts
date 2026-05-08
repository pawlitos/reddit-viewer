import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { RedditListing, RedditPost, SubredditInfo } from '@app/core/models';
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
  private readonly route = inject(ActivatedRoute);
  private postsSubscription?: Subscription;

  protected readonly posts = signal<RedditPost[]>([]);
  protected readonly communities = signal<SubredditInfo[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<unknown>(null);
  protected readonly after = signal<string | null>(null);
  protected readonly hasMore = computed(() => this.after() !== null);

  ngOnInit() {
    const postsListing = this.route.snapshot.data['posts'] as RedditListing<RedditPost>;
    this.posts.set(postsListing.data.children.map((c) => c.data));
    this.after.set(postsListing.data.after);

    const communitiesListing = this.route.snapshot.data['communities'] as RedditListing<SubredditInfo>;
    this.communities.set(communitiesListing.data.children.map((c) => c.data));
  }

  ngOnDestroy() {
    this.postsSubscription?.unsubscribe();
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
}
