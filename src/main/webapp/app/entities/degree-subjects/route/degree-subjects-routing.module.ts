import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DegreeSubjectsComponent } from '../list/degree-subjects.component';
import { DegreeSubjectsDetailComponent } from '../detail/degree-subjects-detail.component';
import { DegreeSubjectsUpdateComponent } from '../update/degree-subjects-update.component';
import { DegreeSubjectsRoutingResolveService } from './degree-subjects-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const degreeSubjectsRoute: Routes = [
  {
    path: '',
    component: DegreeSubjectsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DegreeSubjectsDetailComponent,
    resolve: {
      degreeSubjects: DegreeSubjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DegreeSubjectsUpdateComponent,
    resolve: {
      degreeSubjects: DegreeSubjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DegreeSubjectsUpdateComponent,
    resolve: {
      degreeSubjects: DegreeSubjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(degreeSubjectsRoute)],
  exports: [RouterModule],
})
export class DegreeSubjectsRoutingModule {}
