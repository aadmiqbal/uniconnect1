import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AppUsersFormService, AppUsersFormGroup } from './app-users-form.service';
import { IAppUsers } from '../app-users.model';
import { AppUsersService } from '../service/app-users.service';

@Component({
  selector: 'jhi-app-users-update',
  templateUrl: './app-users-update.component.html',
})
export class AppUsersUpdateComponent implements OnInit {
  isSaving = false;
  appUsers: IAppUsers | null = null;

  editForm: AppUsersFormGroup = this.appUsersFormService.createAppUsersFormGroup();

  constructor(
    protected appUsersService: AppUsersService,
    protected appUsersFormService: AppUsersFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUsers }) => {
      this.appUsers = appUsers;
      if (appUsers) {
        this.updateForm(appUsers);
      }
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
  }
}
