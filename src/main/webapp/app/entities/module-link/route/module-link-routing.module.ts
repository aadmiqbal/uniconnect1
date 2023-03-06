import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ModuleLinkComponent } from '../list/module-link.component';
import { ModuleLinkDetailComponent } from '../detail/module-link-detail.component';
import { ModuleLinkUpdateComponent } from '../update/module-link-update.component';
import { ModuleLinkRoutingResolveService } from './module-link-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const moduleLinkRoute: Routes = [
  {
    path: '',
    component: ModuleLinkComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ModuleLinkDetailComponent,
    resolve: {
      moduleLink: ModuleLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ModuleLinkUpdateComponent,
    resolve: {
      moduleLink: ModuleLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ModuleLinkUpdateComponent,
    resolve: {
      moduleLink: ModuleLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(moduleLinkRoute)],
  exports: [RouterModule],
})
export class ModuleLinkRoutingModule {}
