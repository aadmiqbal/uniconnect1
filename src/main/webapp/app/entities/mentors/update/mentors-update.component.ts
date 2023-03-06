import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MentorsFormService, MentorsFormGroup } from './mentors-form.service';
import { IMentors } from '../mentors.model';
import { MentorsService } from '../service/mentors.service';
import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { UserModulesService } from 'app/entities/user-modules/service/user-modules.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

@Component({
  selector: 'jhi-mentors-update',
  templateUrl: './mentors-update.component.html',
})
export class MentorsUpdateComponent implements OnInit {
  isSaving = false;
  mentors: IMentors | null = null;

  userModulesSharedCollection: IUserModules[] = [];
  appUsersSharedCollection: IAppUsers[] = [];

  editForm: MentorsFormGroup = this.mentorsFormService.createMentorsFormGroup();

  constructor(
    protected mentorsService: MentorsService,
    protected mentorsFormService: MentorsFormService,
    protected userModulesService: UserModulesService,
    protected appUsersService: AppUsersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserModules = (o1: IUserModules | null, o2: IUserModules | null): boolean => this.userModulesService.compareUserModules(o1, o2);

  compareAppUsers = (o1: IAppUsers | null, o2: IAppUsers | null): boolean => this.appUsersService.compareAppUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mentors }) => {
      this.mentors = mentors;
      if (mentors) {
        this.updateForm(mentors);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mentors = this.mentorsFormService.getMentors(this.editForm);
    if (mentors.id !== null) {
      this.subscribeToSaveResponse(this.mentorsService.update(mentors));
    } else {
      this.subscribeToSaveResponse(this.mentorsService.create(mentors));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMentors>>): void {
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

  protected updateForm(mentors: IMentors): void {
    this.mentors = mentors;
    this.mentorsFormService.resetForm(this.editForm, mentors);

    this.userModulesSharedCollection = this.userModulesService.addUserModulesToCollectionIfMissing<IUserModules>(
      this.userModulesSharedCollection,
      mentors.module
    );
    this.appUsersSharedCollection = this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(
      this.appUsersSharedCollection,
      mentors.mentorUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userModulesService
      .query()
      .pipe(map((res: HttpResponse<IUserModules[]>) => res.body ?? []))
      .pipe(
        map((userModules: IUserModules[]) =>
          this.userModulesService.addUserModulesToCollectionIfMissing<IUserModules>(userModules, this.mentors?.module)
        )
      )
      .subscribe((userModules: IUserModules[]) => (this.userModulesSharedCollection = userModules));

    this.appUsersService
      .query()
      .pipe(map((res: HttpResponse<IAppUsers[]>) => res.body ?? []))
      .pipe(
        map((appUsers: IAppUsers[]) => this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(appUsers, this.mentors?.mentorUser))
      )
      .subscribe((appUsers: IAppUsers[]) => (this.appUsersSharedCollection = appUsers));
  }
}
