import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserModulesComponent } from './list/user-modules.component';
import { UserModulesDetailComponent } from './detail/user-modules-detail.component';
import { UserModulesUpdateComponent } from './update/user-modules-update.component';
import { UserModulesDeleteDialogComponent } from './delete/user-modules-delete-dialog.component';
import { UserModulesRoutingModule } from './route/user-modules-routing.module';

@NgModule({
  imports: [SharedModule, UserModulesRoutingModule],
  declarations: [UserModulesComponent, UserModulesDetailComponent, UserModulesUpdateComponent, UserModulesDeleteDialogComponent],
})
export class UserModulesModule {}
