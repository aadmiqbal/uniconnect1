import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DegreesComponent } from '../list/degrees.component';
import { DegreesDetailComponent } from '../detail/degrees-detail.component';
import { DegreesUpdateComponent } from '../update/degrees-update.component';
import { DegreesRoutingResolveService } from './degrees-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const degreesRoute: Routes = [
  {
    path: '',
    component: DegreesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DegreesDetailComponent,
    resolve: {
      degrees: DegreesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DegreesUpdateComponent,
    resolve: {
      degrees: DegreesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DegreesUpdateComponent,
    resolve: {
      degrees: DegreesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(degreesRoute)],
  exports: [RouterModule],
})
export class DegreesRoutingModule {}
