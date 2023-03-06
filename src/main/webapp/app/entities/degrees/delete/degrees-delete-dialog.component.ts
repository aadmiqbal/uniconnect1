import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDegrees } from '../degrees.model';
import { DegreesService } from '../service/degrees.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './degrees-delete-dialog.component.html',
})
export class DegreesDeleteDialogComponent {
  degrees?: IDegrees;

  constructor(protected degreesService: DegreesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.degreesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
