import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFriendship } from '../friendship.model';
import { FriendshipService } from '../service/friendship.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './friendship-delete-dialog.component.html',
})
export class FriendshipDeleteDialogComponent {
  friendship?: IFriendship;

  constructor(protected friendshipService: FriendshipService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.friendshipService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
