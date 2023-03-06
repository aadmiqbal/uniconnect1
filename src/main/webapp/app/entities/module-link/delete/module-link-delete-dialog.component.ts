import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IModuleLink } from '../module-link.model';
import { ModuleLinkService } from '../service/module-link.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './module-link-delete-dialog.component.html',
})
export class ModuleLinkDeleteDialogComponent {
  moduleLink?: IModuleLink;

  constructor(protected moduleLinkService: ModuleLinkService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.moduleLinkService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
