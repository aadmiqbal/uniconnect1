import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConnectionsComponent } from './list/connections.component';
import { ConnectionsDetailComponent } from './detail/connections-detail.component';
import { ConnectionsUpdateComponent } from './update/connections-update.component';
import { ConnectionsDeleteDialogComponent } from './delete/connections-delete-dialog.component';
import { ConnectionsRoutingModule } from './route/connections-routing.module';

@NgModule({
  imports: [SharedModule, ConnectionsRoutingModule],
  declarations: [ConnectionsComponent, ConnectionsDetailComponent, ConnectionsUpdateComponent, ConnectionsDeleteDialogComponent],
})
export class ConnectionsModule {}
