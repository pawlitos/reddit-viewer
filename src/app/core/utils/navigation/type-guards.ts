import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';

import { NavigationCompleteEvent, NavigationEndEvent } from './types';

export function isNavigationStartEvent(event: Event): event is NavigationStart {
  return event instanceof NavigationStart;
}

export function isNavigationEndEvent(event: Event): event is NavigationEndEvent {
  return event instanceof NavigationEnd || event instanceof NavigationCancel;
}

export function isNavigationErrorEvent(event: Event): event is NavigationError {
  return event instanceof NavigationError;
}

export function isNavigationCompleteEvent(event: Event): event is NavigationCompleteEvent {
  return isNavigationEndEvent(event) || isNavigationErrorEvent(event);
}
