import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FinalUserComponent } from '../list/final-user.component';
import { FinalUserDetailComponent } from '../detail/final-user-detail.component';
import { FinalUserUpdateComponent } from '../update/final-user-update.component';
import { FinalUserRoutingResolveService } from './final-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const finalUserRoute: Routes = [
  {
    path: '',
    component: FinalUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinalUserDetailComponent,
    resolve: {
      finalUser: FinalUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinalUserUpdateComponent,
    resolve: {
      finalUser: FinalUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinalUserUpdateComponent,
    resolve: {
      finalUser: FinalUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(finalUserRoute)],
  exports: [RouterModule],
})
export class FinalUserRoutingModule {}
