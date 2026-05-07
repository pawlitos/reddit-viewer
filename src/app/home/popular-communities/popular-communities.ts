import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SubredditInfo } from '@app/core/models';

@Component({
  selector: 'app-popular-communities',
  imports: [RouterLink],
  templateUrl: './popular-communities.html',
  styleUrl: './popular-communities.scss',
})
export class PopularCommunities {
  readonly communities = input.required<SubredditInfo[]>();
  protected readonly isExpanded = signal(false);
  protected readonly visibleCommunities = computed(() => {
    const communities = this.communities();

    return this.isExpanded() ? communities : communities.slice(0, 5);
  });
  protected readonly canToggle = computed(() => this.communities().length > 5);

  protected showAll() {
    this.isExpanded.set(true);
  }

  protected showLess() {
    this.isExpanded.set(false);
  }

  protected getCommunityHref(name: string) {
    return `/r/${name}`;
  }

  protected getCommunityInitials(name: string) {
    return name.slice(0, 2).toUpperCase();
  }

  protected getMembersLabel(count: number) {
    return `${new Intl.NumberFormat('en-US').format(count)} members`;
  }
}
