import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DegreeSubjectsComponent } from './list/degree-subjects.component';
import { DegreeSubjectsDetailComponent } from './detail/degree-subjects-detail.component';
import { DegreeSubjectsUpdateComponent } from './update/degree-subjects-update.component';
import { DegreeSubjectsDeleteDialogComponent } from './delete/degree-subjects-delete-dialog.component';
import { DegreeSubjectsRoutingModule } from './route/degree-subjects-routing.module';

@NgModule({
  imports: [SharedModule, DegreeSubjectsRoutingModule],
  declarations: [
    DegreeSubjectsComponent,
    DegreeSubjectsDetailComponent,
    DegreeSubjectsUpdateComponent,
    DegreeSubjectsDeleteDialogComponent,
  ],
})
export class DegreeSubjectsModule {}
