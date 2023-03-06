import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOptionalModuleLink } from '../optional-module-link.model';
import { OptionalModuleLinkService } from '../service/optional-module-link.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './optional-module-link-delete-dialog.component.html',
})
export class OptionalModuleLinkDeleteDialogComponent {
  optionalModuleLink?: IOptionalModuleLink;

  constructor(protected optionalModuleLinkService: OptionalModuleLinkService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.optionalModuleLinkService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
