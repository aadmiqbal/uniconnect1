import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SubjectsComponent } from './list/subjects.component';
import { SubjectsDetailComponent } from './detail/subjects-detail.component';
import { SubjectsUpdateComponent } from './update/subjects-update.component';
import { SubjectsDeleteDialogComponent } from './delete/subjects-delete-dialog.component';
import { SubjectsRoutingModule } from './route/subjects-routing.module';

@NgModule({
  imports: [SharedModule, SubjectsRoutingModule],
  declarations: [SubjectsComponent, SubjectsDetailComponent, SubjectsUpdateComponent, SubjectsDeleteDialogComponent],
})
export class SubjectsModule {}
