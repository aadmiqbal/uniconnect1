import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AppUsersFormService, AppUsersFormGroup } from './app-users-form.service';
import { IAppUsers } from '../app-users.model';
import { AppUsersService } from '../service/app-users.service';
import { IDegrees } from 'app/entities/degrees/degrees.model';
import { DegreesService } from 'app/entities/degrees/service/degrees.service';

@Component({
  selector: 'jhi-app-users-update',
  templateUrl: './app-users-update.component.html',
})
export class AppUsersUpdateComponent implements OnInit {
  isSaving = false;
  appUsers: IAppUsers | null = null;

  degreesSharedCollection: IDegrees[] = [];

  editForm: AppUsersFormGroup = this.appUsersFormService.createAppUsersFormGroup();

  constructor(
    protected appUsersService: AppUsersService,
    protected appUsersFormService: AppUsersFormService,
    protected degreesService: DegreesService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDegrees = (o1: IDegrees | null, o2: IDegrees | null): boolean => this.degreesService.compareDegrees(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUsers }) => {
      this.appUsers = appUsers;
      if (appUsers) {
        this.updateForm(appUsers);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appUsers = this.appUsersFormService.getAppUsers(this.editForm);
    if (appUsers.id !== null) {
      this.subscribeToSaveResponse(this.appUsersService.update(appUsers));
    } else {
      this.subscribeToSaveResponse(this.appUsersService.create(appUsers));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppUsers>>): void {
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

  protected updateForm(appUsers: IAppUsers): void {
    this.appUsers = appUsers;
    this.appUsersFormService.resetForm(this.editForm, appUsers);

    this.degreesSharedCollection = this.degreesService.addDegreesToCollectionIfMissing<IDegrees>(
      this.degreesSharedCollection,
      appUsers.subject
    );
  }

  protected loadRelationshipsOptions(): void {
    this.degreesService
      .query()
      .pipe(map((res: HttpResponse<IDegrees[]>) => res.body ?? []))
      .pipe(map((degrees: IDegrees[]) => this.degreesService.addDegreesToCollectionIfMissing<IDegrees>(degrees, this.appUsers?.subject)))
      .subscribe((degrees: IDegrees[]) => (this.degreesSharedCollection = degrees));
  }
}
