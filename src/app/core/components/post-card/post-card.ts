import { Component, input } from '@angular/core';

import { RedditPost } from '@app/core/models';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  readonly post = input.required<RedditPost>();
}
