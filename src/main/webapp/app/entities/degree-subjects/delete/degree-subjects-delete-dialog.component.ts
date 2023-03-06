import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDegreeSubjects } from '../degree-subjects.model';
import { DegreeSubjectsService } from '../service/degree-subjects.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './degree-subjects-delete-dialog.component.html',
})
export class DegreeSubjectsDeleteDialogComponent {
  degreeSubjects?: IDegreeSubjects;

  constructor(protected degreeSubjectsService: DegreeSubjectsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.degreeSubjectsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
