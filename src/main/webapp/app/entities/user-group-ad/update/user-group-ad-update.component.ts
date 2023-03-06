import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserGroupAdFormService, UserGroupAdFormGroup } from './user-group-ad-form.service';
import { IUserGroupAd } from '../user-group-ad.model';
import { UserGroupAdService } from '../service/user-group-ad.service';
import { IUserGroups } from 'app/entities/user-groups/user-groups.model';
import { UserGroupsService } from 'app/entities/user-groups/service/user-groups.service';

@Component({
  selector: 'jhi-user-group-ad-update',
  templateUrl: './user-group-ad-update.component.html',
})
export class UserGroupAdUpdateComponent implements OnInit {
  isSaving = false;
  userGroupAd: IUserGroupAd | null = null;

  userGroupsSharedCollection: IUserGroups[] = [];

  editForm: UserGroupAdFormGroup = this.userGroupAdFormService.createUserGroupAdFormGroup();

  constructor(
    protected userGroupAdService: UserGroupAdService,
    protected userGroupAdFormService: UserGroupAdFormService,
    protected userGroupsService: UserGroupsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserGroups = (o1: IUserGroups | null, o2: IUserGroups | null): boolean => this.userGroupsService.compareUserGroups(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userGroupAd }) => {
      this.userGroupAd = userGroupAd;
      if (userGroupAd) {
        this.updateForm(userGroupAd);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userGroupAd = this.userGroupAdFormService.getUserGroupAd(this.editForm);
    if (userGroupAd.id !== null) {
      this.subscribeToSaveResponse(this.userGroupAdService.update(userGroupAd));
    } else {
      this.subscribeToSaveResponse(this.userGroupAdService.create(userGroupAd));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserGroupAd>>): void {
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

  protected updateForm(userGroupAd: IUserGroupAd): void {
    this.userGroupAd = userGroupAd;
    this.userGroupAdFormService.resetForm(this.editForm, userGroupAd);

    this.userGroupsSharedCollection = this.userGroupsService.addUserGroupsToCollectionIfMissing<IUserGroups>(
      this.userGroupsSharedCollection,
      userGroupAd.group
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userGroupsService
      .query()
      .pipe(map((res: HttpResponse<IUserGroups[]>) => res.body ?? []))
      .pipe(
        map((userGroups: IUserGroups[]) =>
          this.userGroupsService.addUserGroupsToCollectionIfMissing<IUserGroups>(userGroups, this.userGroupAd?.group)
        )
      )
      .subscribe((userGroups: IUserGroups[]) => (this.userGroupsSharedCollection = userGroups));
  }
}
