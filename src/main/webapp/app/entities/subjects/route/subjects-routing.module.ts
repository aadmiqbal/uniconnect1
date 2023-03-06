import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SubjectsComponent } from '../list/subjects.component';
import { SubjectsDetailComponent } from '../detail/subjects-detail.component';
import { SubjectsUpdateComponent } from '../update/subjects-update.component';
import { SubjectsRoutingResolveService } from './subjects-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const subjectsRoute: Routes = [
  {
    path: '',
    component: SubjectsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SubjectsDetailComponent,
    resolve: {
      subjects: SubjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SubjectsUpdateComponent,
    resolve: {
      subjects: SubjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SubjectsUpdateComponent,
    resolve: {
      subjects: SubjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(subjectsRoute)],
  exports: [RouterModule],
})
export class SubjectsRoutingModule {}
