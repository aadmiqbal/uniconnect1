import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OptionalModuleLinkComponent } from './list/optional-module-link.component';
import { OptionalModuleLinkDetailComponent } from './detail/optional-module-link-detail.component';
import { OptionalModuleLinkUpdateComponent } from './update/optional-module-link-update.component';
import { OptionalModuleLinkDeleteDialogComponent } from './delete/optional-module-link-delete-dialog.component';
import { OptionalModuleLinkRoutingModule } from './route/optional-module-link-routing.module';

@NgModule({
  imports: [SharedModule, OptionalModuleLinkRoutingModule],
  declarations: [
    OptionalModuleLinkComponent,
    OptionalModuleLinkDetailComponent,
    OptionalModuleLinkUpdateComponent,
    OptionalModuleLinkDeleteDialogComponent,
  ],
})
export class OptionalModuleLinkModule {}
