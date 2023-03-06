import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DegreesFormService, DegreesFormGroup } from './degrees-form.service';
import { IDegrees } from '../degrees.model';
import { DegreesService } from '../service/degrees.service';

@Component({
  selector: 'jhi-degrees-update',
  templateUrl: './degrees-update.component.html',
})
export class DegreesUpdateComponent implements OnInit {
  isSaving = false;
  degrees: IDegrees | null = null;

  editForm: DegreesFormGroup = this.degreesFormService.createDegreesFormGroup();

  constructor(
    protected degreesService: DegreesService,
    protected degreesFormService: DegreesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ degrees }) => {
      this.degrees = degrees;
      if (degrees) {
        this.updateForm(degrees);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const degrees = this.degreesFormService.getDegrees(this.editForm);
    if (degrees.id !== null) {
      this.subscribeToSaveResponse(this.degreesService.update(degrees));
    } else {
      this.subscribeToSaveResponse(this.degreesService.create(degrees));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDegrees>>): void {
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

  protected updateForm(degrees: IDegrees): void {
    this.degrees = degrees;
    this.degreesFormService.resetForm(this.editForm, degrees);
  }
}
