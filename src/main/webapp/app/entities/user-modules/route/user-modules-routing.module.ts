import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserModulesComponent } from '../list/user-modules.component';
import { UserModulesDetailComponent } from '../detail/user-modules-detail.component';
import { UserModulesUpdateComponent } from '../update/user-modules-update.component';
import { UserModulesRoutingResolveService } from './user-modules-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userModulesRoute: Routes = [
  {
    path: '',
    component: UserModulesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserModulesDetailComponent,
    resolve: {
      userModules: UserModulesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserModulesUpdateComponent,
    resolve: {
      userModules: UserModulesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserModulesUpdateComponent,
    resolve: {
      userModules: UserModulesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userModulesRoute)],
  exports: [RouterModule],
})
export class UserModulesRoutingModule {}
