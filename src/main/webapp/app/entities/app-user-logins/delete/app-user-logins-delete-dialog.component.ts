import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppUserLogins } from '../app-user-logins.model';
import { AppUserLoginsService } from '../service/app-user-logins.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './app-user-logins-delete-dialog.component.html',
})
export class AppUserLoginsDeleteDialogComponent {
  appUserLogins?: IAppUserLogins;

  constructor(protected appUserLoginsService: AppUserLoginsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.appUserLoginsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
