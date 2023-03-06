import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserModulesFormService, UserModulesFormGroup } from './user-modules-form.service';
import { IUserModules } from '../user-modules.model';
import { UserModulesService } from '../service/user-modules.service';
import { ISubjects } from 'app/entities/subjects/subjects.model';
import { SubjectsService } from 'app/entities/subjects/service/subjects.service';

@Component({
  selector: 'jhi-user-modules-update',
  templateUrl: './user-modules-update.component.html',
})
export class UserModulesUpdateComponent implements OnInit {
  isSaving = false;
  userModules: IUserModules | null = null;

  subjectsSharedCollection: ISubjects[] = [];

  editForm: UserModulesFormGroup = this.userModulesFormService.createUserModulesFormGroup();

  constructor(
    protected userModulesService: UserModulesService,
    protected userModulesFormService: UserModulesFormService,
    protected subjectsService: SubjectsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSubjects = (o1: ISubjects | null, o2: ISubjects | null): boolean => this.subjectsService.compareSubjects(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userModules }) => {
      this.userModules = userModules;
      if (userModules) {
        this.updateForm(userModules);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userModules = this.userModulesFormService.getUserModules(this.editForm);
    if (userModules.id !== null) {
      this.subscribeToSaveResponse(this.userModulesService.update(userModules));
    } else {
      this.subscribeToSaveResponse(this.userModulesService.create(userModules));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserModules>>): void {
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

  protected updateForm(userModules: IUserModules): void {
    this.userModules = userModules;
    this.userModulesFormService.resetForm(this.editForm, userModules);

    this.subjectsSharedCollection = this.subjectsService.addSubjectsToCollectionIfMissing<ISubjects>(
      this.subjectsSharedCollection,
      userModules.subject
    );
  }

  protected loadRelationshipsOptions(): void {
    this.subjectsService
      .query()
      .pipe(map((res: HttpResponse<ISubjects[]>) => res.body ?? []))
      .pipe(
        map((subjects: ISubjects[]) =>
          this.subjectsService.addSubjectsToCollectionIfMissing<ISubjects>(subjects, this.userModules?.subject)
        )
      )
      .subscribe((subjects: ISubjects[]) => (this.subjectsSharedCollection = subjects));
  }
}
