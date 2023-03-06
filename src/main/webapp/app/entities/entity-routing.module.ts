import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'subjects',
        data: { pageTitle: 'teamprojectApp.subjects.home.title' },
        loadChildren: () => import('./subjects/subjects.module').then(m => m.SubjectsModule),
      },
      {
        path: 'user-modules',
        data: { pageTitle: 'teamprojectApp.userModules.home.title' },
        loadChildren: () => import('./user-modules/user-modules.module').then(m => m.UserModulesModule),
      },
      {
        path: 'app-users',
        data: { pageTitle: 'teamprojectApp.appUsers.home.title' },
        loadChildren: () => import('./app-users/app-users.module').then(m => m.AppUsersModule),
      },
      {
        path: 'optional-module-link',
        data: { pageTitle: 'teamprojectApp.optionalModuleLink.home.title' },
        loadChildren: () => import('./optional-module-link/optional-module-link.module').then(m => m.OptionalModuleLinkModule),
      },
      {
        path: 'mentors',
        data: { pageTitle: 'teamprojectApp.mentors.home.title' },
        loadChildren: () => import('./mentors/mentors.module').then(m => m.MentorsModule),
      },
      {
        path: 'mentor-link',
        data: { pageTitle: 'teamprojectApp.mentorLink.home.title' },
        loadChildren: () => import('./mentor-link/mentor-link.module').then(m => m.MentorLinkModule),
      },
      {
        path: 'mentees',
        data: { pageTitle: 'teamprojectApp.mentees.home.title' },
        loadChildren: () => import('./mentees/mentees.module').then(m => m.MenteesModule),
      },
      {
        path: 'connections',
        data: { pageTitle: 'teamprojectApp.connections.home.title' },
        loadChildren: () => import('./connections/connections.module').then(m => m.ConnectionsModule),
      },
      {
        path: 'user-groups',
        data: { pageTitle: 'teamprojectApp.userGroups.home.title' },
        loadChildren: () => import('./user-groups/user-groups.module').then(m => m.UserGroupsModule),
      },
      {
        path: 'user-group-users',
        data: { pageTitle: 'teamprojectApp.userGroupUsers.home.title' },
        loadChildren: () => import('./user-group-users/user-group-users.module').then(m => m.UserGroupUsersModule),
      },
      {
        path: 'user-group-ad',
        data: { pageTitle: 'teamprojectApp.userGroupAd.home.title' },
        loadChildren: () => import('./user-group-ad/user-group-ad.module').then(m => m.UserGroupAdModule),
      },
      {
        path: 'degrees',
        data: { pageTitle: 'teamprojectApp.degrees.home.title' },
        loadChildren: () => import('./degrees/degrees.module').then(m => m.DegreesModule),
      },
      {
        path: 'degree-subjects',
        data: { pageTitle: 'teamprojectApp.degreeSubjects.home.title' },
        loadChildren: () => import('./degree-subjects/degree-subjects.module').then(m => m.DegreeSubjectsModule),
      },
      {
        path: 'module-link',
        data: { pageTitle: 'teamprojectApp.moduleLink.home.title' },
        loadChildren: () => import('./module-link/module-link.module').then(m => m.ModuleLinkModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
