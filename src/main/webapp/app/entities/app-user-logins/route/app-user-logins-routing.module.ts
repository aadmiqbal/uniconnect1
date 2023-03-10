import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AppUserLoginsComponent } from '../list/app-user-logins.component';
import { AppUserLoginsDetailComponent } from '../detail/app-user-logins-detail.component';
import { AppUserLoginsUpdateComponent } from '../update/app-user-logins-update.component';
import { AppUserLoginsRoutingResolveService } from './app-user-logins-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const appUserLoginsRoute: Routes = [
  {
    path: '',
    component: AppUserLoginsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AppUserLoginsDetailComponent,
    resolve: {
      appUserLogins: AppUserLoginsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AppUserLoginsUpdateComponent,
    resolve: {
      appUserLogins: AppUserLoginsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AppUserLoginsUpdateComponent,
    resolve: {
      appUserLogins: AppUserLoginsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appUserLoginsRoute)],
  exports: [RouterModule],
})
export class AppUserLoginsRoutingModule {}
