import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-subreddit',
  imports: [],
  templateUrl: './subreddit.html',
  styleUrl: './subreddit.scss',
})
export class Subreddit {
  private readonly route = inject(ActivatedRoute);
  readonly subreddit = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('subreddit') ?? ''))
  );
}
