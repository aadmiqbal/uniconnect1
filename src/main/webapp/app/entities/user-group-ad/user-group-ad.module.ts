import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserGroupAdComponent } from './list/user-group-ad.component';
import { UserGroupAdDetailComponent } from './detail/user-group-ad-detail.component';
import { UserGroupAdUpdateComponent } from './update/user-group-ad-update.component';
import { UserGroupAdDeleteDialogComponent } from './delete/user-group-ad-delete-dialog.component';
import { UserGroupAdRoutingModule } from './route/user-group-ad-routing.module';

@NgModule({
  imports: [SharedModule, UserGroupAdRoutingModule],
  declarations: [UserGroupAdComponent, UserGroupAdDetailComponent, UserGroupAdUpdateComponent, UserGroupAdDeleteDialogComponent],
})
export class UserGroupAdModule {}
