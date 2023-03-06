import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConnections } from '../connections.model';
import { ConnectionsService } from '../service/connections.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './connections-delete-dialog.component.html',
})
export class ConnectionsDeleteDialogComponent {
  connections?: IConnections;

  constructor(protected connectionsService: ConnectionsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.connectionsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
