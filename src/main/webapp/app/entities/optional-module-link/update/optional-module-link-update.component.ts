import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OptionalModuleLinkFormService, OptionalModuleLinkFormGroup } from './optional-module-link-form.service';
import { IOptionalModuleLink } from '../optional-module-link.model';
import { OptionalModuleLinkService } from '../service/optional-module-link.service';
import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { UserModulesService } from 'app/entities/user-modules/service/user-modules.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

@Component({
  selector: 'jhi-optional-module-link-update',
  templateUrl: './optional-module-link-update.component.html',
})
export class OptionalModuleLinkUpdateComponent implements OnInit {
  isSaving = false;
  optionalModuleLink: IOptionalModuleLink | null = null;

  userModulesSharedCollection: IUserModules[] = [];
  appUsersSharedCollection: IAppUsers[] = [];

  editForm: OptionalModuleLinkFormGroup = this.optionalModuleLinkFormService.createOptionalModuleLinkFormGroup();

  constructor(
    protected optionalModuleLinkService: OptionalModuleLinkService,
    protected optionalModuleLinkFormService: OptionalModuleLinkFormService,
    protected userModulesService: UserModulesService,
    protected appUsersService: AppUsersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserModules = (o1: IUserModules | null, o2: IUserModules | null): boolean => this.userModulesService.compareUserModules(o1, o2);

  compareAppUsers = (o1: IAppUsers | null, o2: IAppUsers | null): boolean => this.appUsersService.compareAppUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ optionalModuleLink }) => {
      this.optionalModuleLink = optionalModuleLink;
      if (optionalModuleLink) {
        this.updateForm(optionalModuleLink);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const optionalModuleLink = this.optionalModuleLinkFormService.getOptionalModuleLink(this.editForm);
    if (optionalModuleLink.id !== null) {
      this.subscribeToSaveResponse(this.optionalModuleLinkService.update(optionalModuleLink));
    } else {
      this.subscribeToSaveResponse(this.optionalModuleLinkService.create(optionalModuleLink));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOptionalModuleLink>>): void {
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

  protected updateForm(optionalModuleLink: IOptionalModuleLink): void {
    this.optionalModuleLink = optionalModuleLink;
    this.optionalModuleLinkFormService.resetForm(this.editForm, optionalModuleLink);

    this.userModulesSharedCollection = this.userModulesService.addUserModulesToCollectionIfMissing<IUserModules>(
      this.userModulesSharedCollection,
      optionalModuleLink.optionalModule
    );
    this.appUsersSharedCollection = this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(
      this.appUsersSharedCollection,
      optionalModuleLink.optionalModuleUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userModulesService
      .query()
      .pipe(map((res: HttpResponse<IUserModules[]>) => res.body ?? []))
      .pipe(
        map((userModules: IUserModules[]) =>
          this.userModulesService.addUserModulesToCollectionIfMissing<IUserModules>(userModules, this.optionalModuleLink?.optionalModule)
        )
      )
      .subscribe((userModules: IUserModules[]) => (this.userModulesSharedCollection = userModules));

    this.appUsersService
      .query()
      .pipe(map((res: HttpResponse<IAppUsers[]>) => res.body ?? []))
      .pipe(
        map((appUsers: IAppUsers[]) =>
          this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(appUsers, this.optionalModuleLink?.optionalModuleUser)
        )
      )
      .subscribe((appUsers: IAppUsers[]) => (this.appUsersSharedCollection = appUsers));
  }
}
