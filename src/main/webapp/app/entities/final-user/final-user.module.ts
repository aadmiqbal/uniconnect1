import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FinalUserComponent } from './list/final-user.component';
import { FinalUserDetailComponent } from './detail/final-user-detail.component';
import { FinalUserUpdateComponent } from './update/final-user-update.component';
import { FinalUserDeleteDialogComponent } from './delete/final-user-delete-dialog.component';
import { FinalUserRoutingModule } from './route/final-user-routing.module';

@NgModule({
  imports: [SharedModule, FinalUserRoutingModule],
  declarations: [FinalUserComponent, FinalUserDetailComponent, FinalUserUpdateComponent, FinalUserDeleteDialogComponent],
})
export class FinalUserModule {}
