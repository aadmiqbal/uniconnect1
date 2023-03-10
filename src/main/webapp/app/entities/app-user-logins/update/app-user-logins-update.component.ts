import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AppUserLoginsFormService, AppUserLoginsFormGroup } from './app-user-logins-form.service';
import { IAppUserLogins } from '../app-user-logins.model';
import { AppUserLoginsService } from '../service/app-user-logins.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

@Component({
  selector: 'jhi-app-user-logins-update',
  templateUrl: './app-user-logins-update.component.html',
})
export class AppUserLoginsUpdateComponent implements OnInit {
  isSaving = false;
  appUserLogins: IAppUserLogins | null = null;

  appUsersSharedCollection: IAppUsers[] = [];

  editForm: AppUserLoginsFormGroup = this.appUserLoginsFormService.createAppUserLoginsFormGroup();

  constructor(
    protected appUserLoginsService: AppUserLoginsService,
    protected appUserLoginsFormService: AppUserLoginsFormService,
    protected appUsersService: AppUsersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAppUsers = (o1: IAppUsers | null, o2: IAppUsers | null): boolean => this.appUsersService.compareAppUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUserLogins }) => {
      this.appUserLogins = appUserLogins;
      if (appUserLogins) {
        this.updateForm(appUserLogins);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appUserLogins = this.appUserLoginsFormService.getAppUserLogins(this.editForm);
    if (appUserLogins.id !== null) {
      this.subscribeToSaveResponse(this.appUserLoginsService.update(appUserLogins));
    } else {
      this.subscribeToSaveResponse(this.appUserLoginsService.create(appUserLogins));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppUserLogins>>): void {
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

  protected updateForm(appUserLogins: IAppUserLogins): void {
    this.appUserLogins = appUserLogins;
    this.appUserLoginsFormService.resetForm(this.editForm, appUserLogins);

    this.appUsersSharedCollection = this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(
      this.appUsersSharedCollection,
      appUserLogins.appUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appUsersService
      .query()
      .pipe(map((res: HttpResponse<IAppUsers[]>) => res.body ?? []))
      .pipe(
        map((appUsers: IAppUsers[]) =>
          this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(appUsers, this.appUserLogins?.appUser)
        )
      )
      .subscribe((appUsers: IAppUsers[]) => (this.appUsersSharedCollection = appUsers));
  }
}
