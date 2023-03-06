import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserGroupAd } from '../user-group-ad.model';
import { UserGroupAdService } from '../service/user-group-ad.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-group-ad-delete-dialog.component.html',
})
export class UserGroupAdDeleteDialogComponent {
  userGroupAd?: IUserGroupAd;

  constructor(protected userGroupAdService: UserGroupAdService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userGroupAdService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
