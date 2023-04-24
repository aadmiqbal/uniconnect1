import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { Authority } from '../config/authority.constants';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'subjects',
        data: { pageTitle: 'teamprojectApp.subjects.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./subjects/subjects.module').then(m => m.SubjectsModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'user-modules',
        data: { pageTitle: 'teamprojectApp.userModules.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./user-modules/user-modules.module').then(m => m.UserModulesModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'app-users',
        data: { pageTitle: 'teamprojectApp.appUsers.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./app-users/app-users.module').then(m => m.AppUsersModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'optional-module-link',
        data: { pageTitle: 'teamprojectApp.optionalModuleLink.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./optional-module-link/optional-module-link.module').then(m => m.OptionalModuleLinkModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'mentors',
        data: { pageTitle: 'teamprojectApp.mentors.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./mentors/mentors.module').then(m => m.MentorsModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'mentor-link',
        data: { pageTitle: 'teamprojectApp.mentorLink.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./mentor-link/mentor-link.module').then(m => m.MentorLinkModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'mentees',
        data: { pageTitle: 'teamprojectApp.mentees.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./mentees/mentees.module').then(m => m.MenteesModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'connections',
        data: { pageTitle: 'teamprojectApp.connections.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./connections/connections.module').then(m => m.ConnectionsModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'user-groups',
        data: { pageTitle: 'teamprojectApp.userGroups.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./user-groups/user-groups.module').then(m => m.UserGroupsModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'user-group-users',
        data: { pageTitle: 'teamprojectApp.userGroupUsers.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./user-group-users/user-group-users.module').then(m => m.UserGroupUsersModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'user-group-ad',
        data: { pageTitle: 'teamprojectApp.userGroupAd.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./user-group-ad/user-group-ad.module').then(m => m.UserGroupAdModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'degrees',
        data: { pageTitle: 'teamprojectApp.degrees.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./degrees/degrees.module').then(m => m.DegreesModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'degree-subjects',
        data: { pageTitle: 'teamprojectApp.degreeSubjects.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./degree-subjects/degree-subjects.module').then(m => m.DegreeSubjectsModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'module-link',
        data: { pageTitle: 'teamprojectApp.moduleLink.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./module-link/module-link.module').then(m => m.ModuleLinkModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'app-user-logins',
        data: { pageTitle: 'teamprojectApp.appUserLogins.home.title', authorities: [Authority.ADMIN] },
        loadChildren: () => import('./app-user-logins/app-user-logins.module').then(m => m.AppUserLoginsModule),
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'user-extra',
        data: { pageTitle: 'teamprojectApp.userExtra.home.title' },
        loadChildren: () => import('./user-extra/user-extra.module').then(m => m.UserExtraModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
