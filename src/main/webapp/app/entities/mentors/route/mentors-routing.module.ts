import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MentorsComponent } from '../list/mentors.component';
import { MentorsDetailComponent } from '../detail/mentors-detail.component';
import { MentorsUpdateComponent } from '../update/mentors-update.component';
import { MentorsRoutingResolveService } from './mentors-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mentorsRoute: Routes = [
  {
    path: '',
    component: MentorsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MentorsDetailComponent,
    resolve: {
      mentors: MentorsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MentorsUpdateComponent,
    resolve: {
      mentors: MentorsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MentorsUpdateComponent,
    resolve: {
      mentors: MentorsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mentorsRoute)],
  exports: [RouterModule],
})
export class MentorsRoutingModule {}
