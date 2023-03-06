import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UserGroupsFormService, UserGroupsFormGroup } from './user-groups-form.service';
import { IUserGroups } from '../user-groups.model';
import { UserGroupsService } from '../service/user-groups.service';

@Component({
  selector: 'jhi-user-groups-update',
  templateUrl: './user-groups-update.component.html',
})
export class UserGroupsUpdateComponent implements OnInit {
  isSaving = false;
  userGroups: IUserGroups | null = null;

  editForm: UserGroupsFormGroup = this.userGroupsFormService.createUserGroupsFormGroup();

  constructor(
    protected userGroupsService: UserGroupsService,
    protected userGroupsFormService: UserGroupsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userGroups }) => {
      this.userGroups = userGroups;
      if (userGroups) {
        this.updateForm(userGroups);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userGroups = this.userGroupsFormService.getUserGroups(this.editForm);
    if (userGroups.id !== null) {
      this.subscribeToSaveResponse(this.userGroupsService.update(userGroups));
    } else {
      this.subscribeToSaveResponse(this.userGroupsService.create(userGroups));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserGroups>>): void {
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

  protected updateForm(userGroups: IUserGroups): void {
    this.userGroups = userGroups;
    this.userGroupsFormService.resetForm(this.editForm, userGroups);
  }
}
