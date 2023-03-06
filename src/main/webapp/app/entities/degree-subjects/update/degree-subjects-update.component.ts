import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DegreeSubjectsFormService, DegreeSubjectsFormGroup } from './degree-subjects-form.service';
import { IDegreeSubjects } from '../degree-subjects.model';
import { DegreeSubjectsService } from '../service/degree-subjects.service';
import { IDegrees } from 'app/entities/degrees/degrees.model';
import { DegreesService } from 'app/entities/degrees/service/degrees.service';
import { ISubjects } from 'app/entities/subjects/subjects.model';
import { SubjectsService } from 'app/entities/subjects/service/subjects.service';

@Component({
  selector: 'jhi-degree-subjects-update',
  templateUrl: './degree-subjects-update.component.html',
})
export class DegreeSubjectsUpdateComponent implements OnInit {
  isSaving = false;
  degreeSubjects: IDegreeSubjects | null = null;

  degreesSharedCollection: IDegrees[] = [];
  subjectsSharedCollection: ISubjects[] = [];

  editForm: DegreeSubjectsFormGroup = this.degreeSubjectsFormService.createDegreeSubjectsFormGroup();

  constructor(
    protected degreeSubjectsService: DegreeSubjectsService,
    protected degreeSubjectsFormService: DegreeSubjectsFormService,
    protected degreesService: DegreesService,
    protected subjectsService: SubjectsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDegrees = (o1: IDegrees | null, o2: IDegrees | null): boolean => this.degreesService.compareDegrees(o1, o2);

  compareSubjects = (o1: ISubjects | null, o2: ISubjects | null): boolean => this.subjectsService.compareSubjects(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ degreeSubjects }) => {
      this.degreeSubjects = degreeSubjects;
      if (degreeSubjects) {
        this.updateForm(degreeSubjects);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const degreeSubjects = this.degreeSubjectsFormService.getDegreeSubjects(this.editForm);
    if (degreeSubjects.id !== null) {
      this.subscribeToSaveResponse(this.degreeSubjectsService.update(degreeSubjects));
    } else {
      this.subscribeToSaveResponse(this.degreeSubjectsService.create(degreeSubjects));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDegreeSubjects>>): void {
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

  protected updateForm(degreeSubjects: IDegreeSubjects): void {
    this.degreeSubjects = degreeSubjects;
    this.degreeSubjectsFormService.resetForm(this.editForm, degreeSubjects);

    this.degreesSharedCollection = this.degreesService.addDegreesToCollectionIfMissing<IDegrees>(
      this.degreesSharedCollection,
      degreeSubjects.degree
    );
    this.subjectsSharedCollection = this.subjectsService.addSubjectsToCollectionIfMissing<ISubjects>(
      this.subjectsSharedCollection,
      degreeSubjects.subject
    );
  }

  protected loadRelationshipsOptions(): void {
    this.degreesService
      .query()
      .pipe(map((res: HttpResponse<IDegrees[]>) => res.body ?? []))
      .pipe(
        map((degrees: IDegrees[]) => this.degreesService.addDegreesToCollectionIfMissing<IDegrees>(degrees, this.degreeSubjects?.degree))
      )
      .subscribe((degrees: IDegrees[]) => (this.degreesSharedCollection = degrees));

    this.subjectsService
      .query()
      .pipe(map((res: HttpResponse<ISubjects[]>) => res.body ?? []))
      .pipe(
        map((subjects: ISubjects[]) =>
          this.subjectsService.addSubjectsToCollectionIfMissing<ISubjects>(subjects, this.degreeSubjects?.subject)
        )
      )
      .subscribe((subjects: ISubjects[]) => (this.subjectsSharedCollection = subjects));
  }
}
