import { HttpContextToken } from '@angular/common/http';

export const BYPASS_BASE_URL = new HttpContextToken<boolean>(() => false);
