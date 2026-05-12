import { NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';

export type NavigationEndEvent = NavigationEnd | NavigationCancel;
export type NavigationCompleteEvent = NavigationEndEvent | NavigationError;
