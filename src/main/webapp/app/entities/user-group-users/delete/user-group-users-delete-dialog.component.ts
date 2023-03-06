import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserGroupUsers } from '../user-group-users.model';
import { UserGroupUsersService } from '../service/user-group-users.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-group-users-delete-dialog.component.html',
})
export class UserGroupUsersDeleteDialogComponent {
  userGroupUsers?: IUserGroupUsers;

  constructor(protected userGroupUsersService: UserGroupUsersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userGroupUsersService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
