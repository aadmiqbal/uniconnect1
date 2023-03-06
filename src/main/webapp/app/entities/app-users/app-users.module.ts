import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AppUsersComponent } from './list/app-users.component';
import { AppUsersDetailComponent } from './detail/app-users-detail.component';
import { AppUsersUpdateComponent } from './update/app-users-update.component';
import { AppUsersDeleteDialogComponent } from './delete/app-users-delete-dialog.component';
import { AppUsersRoutingModule } from './route/app-users-routing.module';

@NgModule({
  imports: [SharedModule, AppUsersRoutingModule],
  declarations: [AppUsersComponent, AppUsersDetailComponent, AppUsersUpdateComponent, AppUsersDeleteDialogComponent],
})
export class AppUsersModule {}
