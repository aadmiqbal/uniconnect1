import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FriendshipComponent } from './list/friendship.component';
import { FriendshipDetailComponent } from './detail/friendship-detail.component';
import { FriendshipUpdateComponent } from './update/friendship-update.component';
import { FriendshipDeleteDialogComponent } from './delete/friendship-delete-dialog.component';
import { FriendshipRoutingModule } from './route/friendship-routing.module';

@NgModule({
  imports: [SharedModule, FriendshipRoutingModule],
  declarations: [FriendshipComponent, FriendshipDetailComponent, FriendshipUpdateComponent, FriendshipDeleteDialogComponent],
})
export class FriendshipModule {}
