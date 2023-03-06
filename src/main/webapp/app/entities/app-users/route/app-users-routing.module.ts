import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AppUsersComponent } from '../list/app-users.component';
import { AppUsersDetailComponent } from '../detail/app-users-detail.component';
import { AppUsersUpdateComponent } from '../update/app-users-update.component';
import { AppUsersRoutingResolveService } from './app-users-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const appUsersRoute: Routes = [
  {
    path: '',
    component: AppUsersComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AppUsersDetailComponent,
    resolve: {
      appUsers: AppUsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AppUsersUpdateComponent,
    resolve: {
      appUsers: AppUsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AppUsersUpdateComponent,
    resolve: {
      appUsers: AppUsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appUsersRoute)],
  exports: [RouterModule],
})
export class AppUsersRoutingModule {}
