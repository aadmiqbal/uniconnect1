import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserGroupsComponent } from '../list/user-groups.component';
import { UserGroupsDetailComponent } from '../detail/user-groups-detail.component';
import { UserGroupsUpdateComponent } from '../update/user-groups-update.component';
import { UserGroupsRoutingResolveService } from './user-groups-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userGroupsRoute: Routes = [
  {
    path: '',
    component: UserGroupsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserGroupsDetailComponent,
    resolve: {
      userGroups: UserGroupsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserGroupsUpdateComponent,
    resolve: {
      userGroups: UserGroupsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserGroupsUpdateComponent,
    resolve: {
      userGroups: UserGroupsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userGroupsRoute)],
  exports: [RouterModule],
})
export class UserGroupsRoutingModule {}
