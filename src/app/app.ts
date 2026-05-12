import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, skipUntil, take } from 'rxjs';

import { NavigationState } from './core/services';
import { isNavigationEndEvent, isNavigationStartEvent } from './core/utils';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('reddit-viewer');
  protected readonly navigationState = inject(NavigationState);
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(), filter(isNavigationEndEvent), take(1))
      .subscribe(() => this.navigationState.completeFirstNavigation());

    this.router.events
      .pipe(takeUntilDestroyed(), skipUntil(this.router.events.pipe(filter(isNavigationEndEvent))))
      .subscribe((event) => {
        if (isNavigationStartEvent(event)) {
          this.navigationState.startLoading();
        }
        if (isNavigationEndEvent(event)) {
          this.navigationState.stopLoading();
        }
      });
  }
}
