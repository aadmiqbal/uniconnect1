import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FriendshipFormService, FriendshipFormGroup } from './friendship-form.service';
import { IFriendship } from '../friendship.model';
import { FriendshipService } from '../service/friendship.service';
import { IFinalUser } from 'app/entities/final-user/final-user.model';
import { FinalUserService } from 'app/entities/final-user/service/final-user.service';

@Component({
  selector: 'jhi-friendship-update',
  templateUrl: './friendship-update.component.html',
})
export class FriendshipUpdateComponent implements OnInit {
  isSaving = false;
  friendship: IFriendship | null = null;

  finalUsersSharedCollection: IFinalUser[] = [];

  editForm: FriendshipFormGroup = this.friendshipFormService.createFriendshipFormGroup();

  constructor(
    protected friendshipService: FriendshipService,
    protected friendshipFormService: FriendshipFormService,
    protected finalUserService: FinalUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFinalUser = (o1: IFinalUser | null, o2: IFinalUser | null): boolean => this.finalUserService.compareFinalUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ friendship }) => {
      this.friendship = friendship;
      if (friendship) {
        this.updateForm(friendship);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const friendship = this.friendshipFormService.getFriendship(this.editForm);
    if (friendship.id !== null) {
      this.subscribeToSaveResponse(this.friendshipService.update(friendship));
    } else {
      this.subscribeToSaveResponse(this.friendshipService.create(friendship));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFriendship>>): void {
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

  protected updateForm(friendship: IFriendship): void {
    this.friendship = friendship;
    this.friendshipFormService.resetForm(this.editForm, friendship);

    this.finalUsersSharedCollection = this.finalUserService.addFinalUserToCollectionIfMissing<IFinalUser>(
      this.finalUsersSharedCollection,
      friendship.finalUser,
      friendship.finalUser2
    );
  }

  protected loadRelationshipsOptions(): void {
    this.finalUserService
      .query()
      .pipe(map((res: HttpResponse<IFinalUser[]>) => res.body ?? []))
      .pipe(
        map((finalUsers: IFinalUser[]) =>
          this.finalUserService.addFinalUserToCollectionIfMissing<IFinalUser>(
            finalUsers,
            this.friendship?.finalUser,
            this.friendship?.finalUser2
          )
        )
      )
      .subscribe((finalUsers: IFinalUser[]) => (this.finalUsersSharedCollection = finalUsers));
  }
}
