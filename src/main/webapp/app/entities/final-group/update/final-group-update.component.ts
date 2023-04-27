import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FinalGroupFormService, FinalGroupFormGroup } from './final-group-form.service';
import { IFinalGroup } from '../final-group.model';
import { FinalGroupService } from '../service/final-group.service';

@Component({
  selector: 'jhi-final-group-update',
  templateUrl: './final-group-update.component.html',
})
export class FinalGroupUpdateComponent implements OnInit {
  isSaving = false;
  finalGroup: IFinalGroup | null = null;

  editForm: FinalGroupFormGroup = this.finalGroupFormService.createFinalGroupFormGroup();

  constructor(
    protected finalGroupService: FinalGroupService,
    protected finalGroupFormService: FinalGroupFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finalGroup }) => {
      this.finalGroup = finalGroup;
      if (finalGroup) {
        this.updateForm(finalGroup);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const finalGroup = this.finalGroupFormService.getFinalGroup(this.editForm);
    if (finalGroup.id !== null) {
      this.subscribeToSaveResponse(this.finalGroupService.update(finalGroup));
    } else {
      this.subscribeToSaveResponse(this.finalGroupService.create(finalGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinalGroup>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(finalGroup: IFinalGroup): void {
    this.finalGroup = finalGroup;
    this.finalGroupFormService.resetForm(this.editForm, finalGroup);
  }
}
