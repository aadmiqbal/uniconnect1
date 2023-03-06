import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ModuleLinkComponent } from './list/module-link.component';
import { ModuleLinkDetailComponent } from './detail/module-link-detail.component';
import { ModuleLinkUpdateComponent } from './update/module-link-update.component';
import { ModuleLinkDeleteDialogComponent } from './delete/module-link-delete-dialog.component';
import { ModuleLinkRoutingModule } from './route/module-link-routing.module';

@NgModule({
  imports: [SharedModule, ModuleLinkRoutingModule],
  declarations: [ModuleLinkComponent, ModuleLinkDetailComponent, ModuleLinkUpdateComponent, ModuleLinkDeleteDialogComponent],
})
export class ModuleLinkModule {}
