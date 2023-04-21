import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserExtra } from '../user-extra.model';
import { UserExtraService } from '../service/user-extra.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-extra-delete-dialog.component.html',
})
export class UserExtraDeleteDialogComponent {
  userExtra?: IUserExtra;

  constructor(protected userExtraService: UserExtraService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userExtraService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
