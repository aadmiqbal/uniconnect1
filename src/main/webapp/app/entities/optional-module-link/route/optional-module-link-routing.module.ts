import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OptionalModuleLinkComponent } from '../list/optional-module-link.component';
import { OptionalModuleLinkDetailComponent } from '../detail/optional-module-link-detail.component';
import { OptionalModuleLinkUpdateComponent } from '../update/optional-module-link-update.component';
import { OptionalModuleLinkRoutingResolveService } from './optional-module-link-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const optionalModuleLinkRoute: Routes = [
  {
    path: '',
    component: OptionalModuleLinkComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OptionalModuleLinkDetailComponent,
    resolve: {
      optionalModuleLink: OptionalModuleLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OptionalModuleLinkUpdateComponent,
    resolve: {
      optionalModuleLink: OptionalModuleLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OptionalModuleLinkUpdateComponent,
    resolve: {
      optionalModuleLink: OptionalModuleLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(optionalModuleLinkRoute)],
  exports: [RouterModule],
})
export class OptionalModuleLinkRoutingModule {}
