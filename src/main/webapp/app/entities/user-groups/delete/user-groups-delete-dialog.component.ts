import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserGroups } from '../user-groups.model';
import { UserGroupsService } from '../service/user-groups.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-groups-delete-dialog.component.html',
})
export class UserGroupsDeleteDialogComponent {
  userGroups?: IUserGroups;

  constructor(protected userGroupsService: UserGroupsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userGroupsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
