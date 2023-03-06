import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserGroupsComponent } from './list/user-groups.component';
import { UserGroupsDetailComponent } from './detail/user-groups-detail.component';
import { UserGroupsUpdateComponent } from './update/user-groups-update.component';
import { UserGroupsDeleteDialogComponent } from './delete/user-groups-delete-dialog.component';
import { UserGroupsRoutingModule } from './route/user-groups-routing.module';

@NgModule({
  imports: [SharedModule, UserGroupsRoutingModule],
  declarations: [UserGroupsComponent, UserGroupsDetailComponent, UserGroupsUpdateComponent, UserGroupsDeleteDialogComponent],
})
export class UserGroupsModule {}
