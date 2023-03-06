import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ModuleLinkFormService, ModuleLinkFormGroup } from './module-link-form.service';
import { IModuleLink } from '../module-link.model';
import { ModuleLinkService } from '../service/module-link.service';
import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { UserModulesService } from 'app/entities/user-modules/service/user-modules.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

@Component({
  selector: 'jhi-module-link-update',
  templateUrl: './module-link-update.component.html',
})
export class ModuleLinkUpdateComponent implements OnInit {
  isSaving = false;
  moduleLink: IModuleLink | null = null;

  userModulesSharedCollection: IUserModules[] = [];
  appUsersSharedCollection: IAppUsers[] = [];

  editForm: ModuleLinkFormGroup = this.moduleLinkFormService.createModuleLinkFormGroup();

  constructor(
    protected moduleLinkService: ModuleLinkService,
    protected moduleLinkFormService: ModuleLinkFormService,
    protected userModulesService: UserModulesService,
    protected appUsersService: AppUsersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserModules = (o1: IUserModules | null, o2: IUserModules | null): boolean => this.userModulesService.compareUserModules(o1, o2);

  compareAppUsers = (o1: IAppUsers | null, o2: IAppUsers | null): boolean => this.appUsersService.compareAppUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moduleLink }) => {
      this.moduleLink = moduleLink;
      if (moduleLink) {
        this.updateForm(moduleLink);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const moduleLink = this.moduleLinkFormService.getModuleLink(this.editForm);
    if (moduleLink.id !== null) {
      this.subscribeToSaveResponse(this.moduleLinkService.update(moduleLink));
    } else {
      this.subscribeToSaveResponse(this.moduleLinkService.create(moduleLink));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IModuleLink>>): void {
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

  protected updateForm(moduleLink: IModuleLink): void {
    this.moduleLink = moduleLink;
    this.moduleLinkFormService.resetForm(this.editForm, moduleLink);

    this.userModulesSharedCollection = this.userModulesService.addUserModulesToCollectionIfMissing<IUserModules>(
      this.userModulesSharedCollection,
      moduleLink.optionalModule
    );
    this.appUsersSharedCollection = this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(
      this.appUsersSharedCollection,
      moduleLink.optionalModuleUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userModulesService
      .query()
      .pipe(map((res: HttpResponse<IUserModules[]>) => res.body ?? []))
      .pipe(
        map((userModules: IUserModules[]) =>
          this.userModulesService.addUserModulesToCollectionIfMissing<IUserModules>(userModules, this.moduleLink?.optionalModule)
        )
      )
      .subscribe((userModules: IUserModules[]) => (this.userModulesSharedCollection = userModules));

    this.appUsersService
      .query()
      .pipe(map((res: HttpResponse<IAppUsers[]>) => res.body ?? []))
      .pipe(
        map((appUsers: IAppUsers[]) =>
          this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(appUsers, this.moduleLink?.optionalModuleUser)
        )
      )
      .subscribe((appUsers: IAppUsers[]) => (this.appUsersSharedCollection = appUsers));
  }
}
