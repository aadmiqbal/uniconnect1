import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserGroupUsersComponent } from '../list/user-group-users.component';
import { UserGroupUsersDetailComponent } from '../detail/user-group-users-detail.component';
import { UserGroupUsersUpdateComponent } from '../update/user-group-users-update.component';
import { UserGroupUsersRoutingResolveService } from './user-group-users-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userGroupUsersRoute: Routes = [
  {
    path: '',
    component: UserGroupUsersComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserGroupUsersDetailComponent,
    resolve: {
      userGroupUsers: UserGroupUsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserGroupUsersUpdateComponent,
    resolve: {
      userGroupUsers: UserGroupUsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserGroupUsersUpdateComponent,
    resolve: {
      userGroupUsers: UserGroupUsersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userGroupUsersRoute)],
  exports: [RouterModule],
})
export class UserGroupUsersRoutingModule {}
