import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FriendshipComponent } from '../list/friendship.component';
import { FriendshipDetailComponent } from '../detail/friendship-detail.component';
import { FriendshipUpdateComponent } from '../update/friendship-update.component';
import { FriendshipRoutingResolveService } from './friendship-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const friendshipRoute: Routes = [
  {
    path: '',
    component: FriendshipComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FriendshipDetailComponent,
    resolve: {
      friendship: FriendshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FriendshipUpdateComponent,
    resolve: {
      friendship: FriendshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FriendshipUpdateComponent,
    resolve: {
      friendship: FriendshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(friendshipRoute)],
  exports: [RouterModule],
})
export class FriendshipRoutingModule {}
