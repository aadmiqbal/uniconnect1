import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FinalGroupComponent } from './list/final-group.component';
import { FinalGroupDetailComponent } from './detail/final-group-detail.component';
import { FinalGroupUpdateComponent } from './update/final-group-update.component';
import { FinalGroupDeleteDialogComponent } from './delete/final-group-delete-dialog.component';
import { FinalGroupRoutingModule } from './route/final-group-routing.module';

@NgModule({
  imports: [SharedModule, FinalGroupRoutingModule],
  declarations: [FinalGroupComponent, FinalGroupDetailComponent, FinalGroupUpdateComponent, FinalGroupDeleteDialogComponent],
})
export class FinalGroupModule {}
