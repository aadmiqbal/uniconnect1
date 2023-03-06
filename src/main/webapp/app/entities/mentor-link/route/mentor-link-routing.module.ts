import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MentorLinkComponent } from '../list/mentor-link.component';
import { MentorLinkDetailComponent } from '../detail/mentor-link-detail.component';
import { MentorLinkUpdateComponent } from '../update/mentor-link-update.component';
import { MentorLinkRoutingResolveService } from './mentor-link-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mentorLinkRoute: Routes = [
  {
    path: '',
    component: MentorLinkComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MentorLinkDetailComponent,
    resolve: {
      mentorLink: MentorLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MentorLinkUpdateComponent,
    resolve: {
      mentorLink: MentorLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MentorLinkUpdateComponent,
    resolve: {
      mentorLink: MentorLinkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mentorLinkRoute)],
  exports: [RouterModule],
})
export class MentorLinkRoutingModule {}
