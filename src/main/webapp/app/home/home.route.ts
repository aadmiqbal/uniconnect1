import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { ConnectionsFeedComponent } from '../connections-feed/connections-feed.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
  },
};
export const MY_COMPONENT_ROUTE: Route = {
  path: 'connections-feed',
  component: ConnectionsFeedComponent,
  data: {
    authorities: [],
    pageTitle: 'feed.title',
  },
};
/*
export const DISPLAY_ROUTE: Route = {
  path: 'displayFeed',
  component: HomeComponent,
  data: {
    pageTitle: 'displayFeed.title',
  },
}; */
