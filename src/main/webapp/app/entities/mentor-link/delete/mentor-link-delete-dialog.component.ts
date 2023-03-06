import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMentorLink } from '../mentor-link.model';
import { MentorLinkService } from '../service/mentor-link.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mentor-link-delete-dialog.component.html',
})
export class MentorLinkDeleteDialogComponent {
  mentorLink?: IMentorLink;

  constructor(protected mentorLinkService: MentorLinkService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mentorLinkService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
