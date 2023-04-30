import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
//
import { ConnectionsFeedComponent } from './connections-feed/connections-feed.component';

import { GroupsettingsComponent } from './groupsettings/groupsettings.component';

import { MentorModuleSelectionComponent } from './mentor-module-selection/mentor-module-selection.component';
import { MenteeModuleSelectionComponent } from './mentee-module-selection/mentee-module-selection.component';
import { GroupFeedComponent } from './group-feed/group-feed.component';
import { ChatGroupComponent } from './chat-group/chat-group.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'privacy-policy',
          component: PrivacyPolicyComponent,
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },

        {
          path: 'group-feed',
          component: GroupFeedComponent,
          canActivate: [UserRouteAccessService],
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
            pageTitle: 'Connections Feed',
          },
        },
        {
          path: 'groupsettings/:groupId',
          component: GroupsettingsComponent,
          canActivate: [UserRouteAccessService],
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
            pageTitle: 'Group Settings',
          },
        },
        {
          path: 'connections-feed',
          component: ConnectionsFeedComponent,
          canActivate: [UserRouteAccessService],
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
            pageTitle: 'Connections Feed',
          },
        },
        {
          path: 'chat-group',
          component: ChatGroupComponent,
          canActivate: [UserRouteAccessService],
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
            pageTitle: 'Chat Group',
          },
        },
        {
          path: 'mentor-module-selection',
          component: MentorModuleSelectionComponent,
          canActivate: [UserRouteAccessService],
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
            pageTitle: 'Mentor module selection',
          },
        },
        {
          path: 'mentee-module-selection',
          component: MenteeModuleSelectionComponent,
          canActivate: [UserRouteAccessService],
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
            pageTitle: 'Mentee module selection',
          },
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
