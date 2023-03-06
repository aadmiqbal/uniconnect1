import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MenteesComponent } from './list/mentees.component';
import { MenteesDetailComponent } from './detail/mentees-detail.component';
import { MenteesUpdateComponent } from './update/mentees-update.component';
import { MenteesDeleteDialogComponent } from './delete/mentees-delete-dialog.component';
import { MenteesRoutingModule } from './route/mentees-routing.module';

@NgModule({
  imports: [SharedModule, MenteesRoutingModule],
  declarations: [MenteesComponent, MenteesDetailComponent, MenteesUpdateComponent, MenteesDeleteDialogComponent],
})
export class MenteesModule {}
