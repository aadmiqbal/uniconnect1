import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserGroupUsersFormService, UserGroupUsersFormGroup } from './user-group-users-form.service';
import { IUserGroupUsers } from '../user-group-users.model';
import { UserGroupUsersService } from '../service/user-group-users.service';
import { IUserGroups } from 'app/entities/user-groups/user-groups.model';
import { UserGroupsService } from 'app/entities/user-groups/service/user-groups.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

@Component({
  selector: 'jhi-user-group-users-update',
  templateUrl: './user-group-users-update.component.html',
})
export class UserGroupUsersUpdateComponent implements OnInit {
  isSaving = false;
  userGroupUsers: IUserGroupUsers | null = null;

  userGroupsSharedCollection: IUserGroups[] = [];
  appUsersSharedCollection: IAppUsers[] = [];

  editForm: UserGroupUsersFormGroup = this.userGroupUsersFormService.createUserGroupUsersFormGroup();

  constructor(
    protected userGroupUsersService: UserGroupUsersService,
    protected userGroupUsersFormService: UserGroupUsersFormService,
    protected userGroupsService: UserGroupsService,
    protected appUsersService: AppUsersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserGroups = (o1: IUserGroups | null, o2: IUserGroups | null): boolean => this.userGroupsService.compareUserGroups(o1, o2);

  compareAppUsers = (o1: IAppUsers | null, o2: IAppUsers | null): boolean => this.appUsersService.compareAppUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userGroupUsers }) => {
      this.userGroupUsers = userGroupUsers;
      if (userGroupUsers) {
        this.updateForm(userGroupUsers);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userGroupUsers = this.userGroupUsersFormService.getUserGroupUsers(this.editForm);
    if (userGroupUsers.id !== null) {
      this.subscribeToSaveResponse(this.userGroupUsersService.update(userGroupUsers));
    } else {
      this.subscribeToSaveResponse(this.userGroupUsersService.create(userGroupUsers));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserGroupUsers>>): void {
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

  protected updateForm(userGroupUsers: IUserGroupUsers): void {
    this.userGroupUsers = userGroupUsers;
    this.userGroupUsersFormService.resetForm(this.editForm, userGroupUsers);

    this.userGroupsSharedCollection = this.userGroupsService.addUserGroupsToCollectionIfMissing<IUserGroups>(
      this.userGroupsSharedCollection,
      userGroupUsers.group
    );
    this.appUsersSharedCollection = this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(
      this.appUsersSharedCollection,
      userGroupUsers.user
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userGroupsService
      .query()
      .pipe(map((res: HttpResponse<IUserGroups[]>) => res.body ?? []))
      .pipe(
        map((userGroups: IUserGroups[]) =>
          this.userGroupsService.addUserGroupsToCollectionIfMissing<IUserGroups>(userGroups, this.userGroupUsers?.group)
        )
      )
      .subscribe((userGroups: IUserGroups[]) => (this.userGroupsSharedCollection = userGroups));

    this.appUsersService
      .query()
      .pipe(map((res: HttpResponse<IAppUsers[]>) => res.body ?? []))
      .pipe(
        map((appUsers: IAppUsers[]) =>
          this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(appUsers, this.userGroupUsers?.user)
        )
      )
      .subscribe((appUsers: IAppUsers[]) => (this.appUsersSharedCollection = appUsers));
  }
}
