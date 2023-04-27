import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinalGroup } from '../final-group.model';
import { FinalGroupService } from '../service/final-group.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './final-group-delete-dialog.component.html',
})
export class FinalGroupDeleteDialogComponent {
  finalGroup?: IFinalGroup;

  constructor(protected finalGroupService: FinalGroupService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.finalGroupService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
