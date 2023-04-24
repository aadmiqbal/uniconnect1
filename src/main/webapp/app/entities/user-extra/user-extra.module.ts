import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserExtraComponent } from './list/user-extra.component';
import { UserExtraDetailComponent } from './detail/user-extra-detail.component';
import { UserExtraUpdateComponent } from './update/user-extra-update.component';
import { UserExtraDeleteDialogComponent } from './delete/user-extra-delete-dialog.component';
import { UserExtraRoutingModule } from './route/user-extra-routing.module';

@NgModule({
  imports: [SharedModule, UserExtraRoutingModule],
  declarations: [UserExtraComponent, UserExtraDetailComponent, UserExtraUpdateComponent, UserExtraDeleteDialogComponent],
})
export class UserExtraModule {}
