import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubjects } from '../subjects.model';
import { SubjectsService } from '../service/subjects.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './subjects-delete-dialog.component.html',
})
export class SubjectsDeleteDialogComponent {
  subjects?: ISubjects;

  constructor(protected subjectsService: SubjectsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.subjectsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
