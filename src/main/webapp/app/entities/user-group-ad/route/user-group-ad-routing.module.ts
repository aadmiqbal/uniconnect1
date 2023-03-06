import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserGroupAdComponent } from '../list/user-group-ad.component';
import { UserGroupAdDetailComponent } from '../detail/user-group-ad-detail.component';
import { UserGroupAdUpdateComponent } from '../update/user-group-ad-update.component';
import { UserGroupAdRoutingResolveService } from './user-group-ad-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userGroupAdRoute: Routes = [
  {
    path: '',
    component: UserGroupAdComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserGroupAdDetailComponent,
    resolve: {
      userGroupAd: UserGroupAdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserGroupAdUpdateComponent,
    resolve: {
      userGroupAd: UserGroupAdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserGroupAdUpdateComponent,
    resolve: {
      userGroupAd: UserGroupAdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userGroupAdRoute)],
  exports: [RouterModule],
})
export class UserGroupAdRoutingModule {}
