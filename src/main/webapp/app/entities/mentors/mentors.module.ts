import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MentorsComponent } from './list/mentors.component';
import { MentorsDetailComponent } from './detail/mentors-detail.component';
import { MentorsUpdateComponent } from './update/mentors-update.component';
import { MentorsDeleteDialogComponent } from './delete/mentors-delete-dialog.component';
import { MentorsRoutingModule } from './route/mentors-routing.module';

@NgModule({
  imports: [SharedModule, MentorsRoutingModule],
  declarations: [MentorsComponent, MentorsDetailComponent, MentorsUpdateComponent, MentorsDeleteDialogComponent],
})
export class MentorsModule {}
