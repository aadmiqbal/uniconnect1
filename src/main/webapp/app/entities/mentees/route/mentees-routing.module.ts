import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MenteesComponent } from '../list/mentees.component';
import { MenteesDetailComponent } from '../detail/mentees-detail.component';
import { MenteesUpdateComponent } from '../update/mentees-update.component';
import { MenteesRoutingResolveService } from './mentees-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const menteesRoute: Routes = [
  {
    path: '',
    component: MenteesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MenteesDetailComponent,
    resolve: {
      mentees: MenteesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MenteesUpdateComponent,
    resolve: {
      mentees: MenteesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MenteesUpdateComponent,
    resolve: {
      mentees: MenteesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(menteesRoute)],
  exports: [RouterModule],
})
export class MenteesRoutingModule {}
