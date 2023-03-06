import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConnectionsComponent } from '../list/connections.component';
import { ConnectionsDetailComponent } from '../detail/connections-detail.component';
import { ConnectionsUpdateComponent } from '../update/connections-update.component';
import { ConnectionsRoutingResolveService } from './connections-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const connectionsRoute: Routes = [
  {
    path: '',
    component: ConnectionsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConnectionsDetailComponent,
    resolve: {
      connections: ConnectionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConnectionsUpdateComponent,
    resolve: {
      connections: ConnectionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConnectionsUpdateComponent,
    resolve: {
      connections: ConnectionsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(connectionsRoute)],
  exports: [RouterModule],
})
export class ConnectionsRoutingModule {}
