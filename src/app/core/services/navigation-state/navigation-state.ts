import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationState {
  private readonly loading = signal(false);
  private readonly firstNavigation = signal(true);

  isLoading = this.loading.asReadonly();
  isFirstNavigation = this.firstNavigation.asReadonly();

  startLoading() {
    this.loading.set(true);
  }

  stopLoading() {
    this.loading.set(false);
  }

  completeFirstNavigation() {
    this.firstNavigation.set(false);
  }
}
