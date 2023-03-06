import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserModules } from '../user-modules.model';
import { UserModulesService } from '../service/user-modules.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-modules-delete-dialog.component.html',
})
export class UserModulesDeleteDialogComponent {
  userModules?: IUserModules;

  constructor(protected userModulesService: UserModulesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userModulesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
