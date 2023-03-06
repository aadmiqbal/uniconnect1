import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppUsers } from '../app-users.model';
import { AppUsersService } from '../service/app-users.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './app-users-delete-dialog.component.html',
})
export class AppUsersDeleteDialogComponent {
  appUsers?: IAppUsers;

  constructor(protected appUsersService: AppUsersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.appUsersService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
