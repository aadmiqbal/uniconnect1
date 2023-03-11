import { Route } from '@angular/router';

import { HomeComponent } from './home.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
  },
};

export const DISPLAY_ROUTE: Route = {
  path: 'displayFeed',
  component: HomeComponent,
  data: {
    pageTitle: 'displayFeed.title',
  },
};
