import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserGroupUsersComponent } from './list/user-group-users.component';
import { UserGroupUsersDetailComponent } from './detail/user-group-users-detail.component';
import { UserGroupUsersUpdateComponent } from './update/user-group-users-update.component';
import { UserGroupUsersDeleteDialogComponent } from './delete/user-group-users-delete-dialog.component';
import { UserGroupUsersRoutingModule } from './route/user-group-users-routing.module';

@NgModule({
  imports: [SharedModule, UserGroupUsersRoutingModule],
  declarations: [
    UserGroupUsersComponent,
    UserGroupUsersDetailComponent,
    UserGroupUsersUpdateComponent,
    UserGroupUsersDeleteDialogComponent,
  ],
})
export class UserGroupUsersModule {}
