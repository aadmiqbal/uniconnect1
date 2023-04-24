import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FinalUserFormService, FinalUserFormGroup } from './final-user-form.service';
import { IFinalUser } from '../final-user.model';
import { FinalUserService } from '../service/final-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-final-user-update',
  templateUrl: './final-user-update.component.html',
})
export class FinalUserUpdateComponent implements OnInit {
  isSaving = false;
  finalUser: IFinalUser | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: FinalUserFormGroup = this.finalUserFormService.createFinalUserFormGroup();

  constructor(
    protected finalUserService: FinalUserService,
    protected finalUserFormService: FinalUserFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finalUser }) => {
      this.finalUser = finalUser;
      if (finalUser) {
        this.updateForm(finalUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const finalUser = this.finalUserFormService.getFinalUser(this.editForm);
    if (finalUser.id !== null) {
      this.subscribeToSaveResponse(this.finalUserService.update(finalUser));
    } else {
      this.subscribeToSaveResponse(this.finalUserService.create(finalUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinalUser>>): void {
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

  protected updateForm(finalUser: IFinalUser): void {
    this.finalUser = finalUser;
    this.finalUserFormService.resetForm(this.editForm, finalUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, finalUser.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.finalUser?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
