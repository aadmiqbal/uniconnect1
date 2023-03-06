import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DegreesComponent } from './list/degrees.component';
import { DegreesDetailComponent } from './detail/degrees-detail.component';
import { DegreesUpdateComponent } from './update/degrees-update.component';
import { DegreesDeleteDialogComponent } from './delete/degrees-delete-dialog.component';
import { DegreesRoutingModule } from './route/degrees-routing.module';

@NgModule({
  imports: [SharedModule, DegreesRoutingModule],
  declarations: [DegreesComponent, DegreesDetailComponent, DegreesUpdateComponent, DegreesDeleteDialogComponent],
})
export class DegreesModule {}
