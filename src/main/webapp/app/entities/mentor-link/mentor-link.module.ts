import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MentorLinkComponent } from './list/mentor-link.component';
import { MentorLinkDetailComponent } from './detail/mentor-link-detail.component';
import { MentorLinkUpdateComponent } from './update/mentor-link-update.component';
import { MentorLinkDeleteDialogComponent } from './delete/mentor-link-delete-dialog.component';
import { MentorLinkRoutingModule } from './route/mentor-link-routing.module';

@NgModule({
  imports: [SharedModule, MentorLinkRoutingModule],
  declarations: [MentorLinkComponent, MentorLinkDetailComponent, MentorLinkUpdateComponent, MentorLinkDeleteDialogComponent],
})
export class MentorLinkModule {}
