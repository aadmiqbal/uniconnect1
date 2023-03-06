import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SubjectsFormService, SubjectsFormGroup } from './subjects-form.service';
import { ISubjects } from '../subjects.model';
import { SubjectsService } from '../service/subjects.service';

@Component({
  selector: 'jhi-subjects-update',
  templateUrl: './subjects-update.component.html',
})
export class SubjectsUpdateComponent implements OnInit {
  isSaving = false;
  subjects: ISubjects | null = null;

  editForm: SubjectsFormGroup = this.subjectsFormService.createSubjectsFormGroup();

  constructor(
    protected subjectsService: SubjectsService,
    protected subjectsFormService: SubjectsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subjects }) => {
      this.subjects = subjects;
      if (subjects) {
        this.updateForm(subjects);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subjects = this.subjectsFormService.getSubjects(this.editForm);
    if (subjects.id !== null) {
      this.subscribeToSaveResponse(this.subjectsService.update(subjects));
    } else {
      this.subscribeToSaveResponse(this.subjectsService.create(subjects));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubjects>>): void {
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

  protected updateForm(subjects: ISubjects): void {
    this.subjects = subjects;
    this.subjectsFormService.resetForm(this.editForm, subjects);
  }
}
