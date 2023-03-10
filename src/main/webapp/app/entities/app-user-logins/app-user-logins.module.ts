import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AppUserLoginsComponent } from './list/app-user-logins.component';
import { AppUserLoginsDetailComponent } from './detail/app-user-logins-detail.component';
import { AppUserLoginsUpdateComponent } from './update/app-user-logins-update.component';
import { AppUserLoginsDeleteDialogComponent } from './delete/app-user-logins-delete-dialog.component';
import { AppUserLoginsRoutingModule } from './route/app-user-logins-routing.module';

@NgModule({
  imports: [SharedModule, AppUserLoginsRoutingModule],
  declarations: [AppUserLoginsComponent, AppUserLoginsDetailComponent, AppUserLoginsUpdateComponent, AppUserLoginsDeleteDialogComponent],
})
export class AppUserLoginsModule {}
