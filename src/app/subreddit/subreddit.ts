import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { PostCard } from '@app/core/components';
import { RedditListing, RedditPost } from '@app/core/models';
import { Reddit } from '@app/core/services';

@Component({
  selector: 'app-subreddit',
  imports: [PostCard],
  templateUrl: './subreddit.html',
  styleUrl: './subreddit.scss',
})
export class Subreddit implements OnInit, OnDestroy {
  private readonly reddit = inject(Reddit);
  private readonly route = inject(ActivatedRoute);
  private postsSubscription?: Subscription;

  protected readonly subreddit = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('subreddit') ?? '')),
    { initialValue: '' },
  );
  protected readonly posts = signal<RedditPost[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<unknown>(null);
  protected readonly after = signal<string | null>(null);
  protected readonly hasMore = computed(() => this.after() !== null);

  ngOnInit() {
    const postsListing = this.route.snapshot.data['posts'] as RedditListing<RedditPost>;
    this.posts.set(postsListing.data.children.map((c) => c.data));
    this.after.set(postsListing.data.after);
    console.log(this.posts());
  }

  ngOnDestroy() {
    this.postsSubscription?.unsubscribe();
  }

  protected loadPosts() {
    this.isLoading.set(true);
    this.error.set(null);
    this.postsSubscription = this.reddit
      .getPosts(this.subreddit(), 'hot', 10, this.after())
      .subscribe({
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
