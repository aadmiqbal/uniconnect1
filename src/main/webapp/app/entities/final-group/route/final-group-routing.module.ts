import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FinalGroupComponent } from '../list/final-group.component';
import { FinalGroupDetailComponent } from '../detail/final-group-detail.component';
import { FinalGroupUpdateComponent } from '../update/final-group-update.component';
import { FinalGroupRoutingResolveService } from './final-group-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const finalGroupRoute: Routes = [
  {
    path: '',
    component: FinalGroupComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinalGroupDetailComponent,
    resolve: {
      finalGroup: FinalGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinalGroupUpdateComponent,
    resolve: {
      finalGroup: FinalGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinalGroupUpdateComponent,
    resolve: {
      finalGroup: FinalGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(finalGroupRoute)],
  exports: [RouterModule],
})
export class FinalGroupRoutingModule {}
