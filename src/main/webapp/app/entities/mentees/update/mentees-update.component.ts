import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MenteesFormService, MenteesFormGroup } from './mentees-form.service';
import { IMentees } from '../mentees.model';
import { MenteesService } from '../service/mentees.service';
import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { UserModulesService } from 'app/entities/user-modules/service/user-modules.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

@Component({
  selector: 'jhi-mentees-update',
  templateUrl: './mentees-update.component.html',
})
export class MenteesUpdateComponent implements OnInit {
  isSaving = false;
  mentees: IMentees | null = null;

  userModulesSharedCollection: IUserModules[] = [];
  appUsersSharedCollection: IAppUsers[] = [];

  editForm: MenteesFormGroup = this.menteesFormService.createMenteesFormGroup();

  constructor(
    protected menteesService: MenteesService,
    protected menteesFormService: MenteesFormService,
    protected userModulesService: UserModulesService,
    protected appUsersService: AppUsersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserModules = (o1: IUserModules | null, o2: IUserModules | null): boolean => this.userModulesService.compareUserModules(o1, o2);

  compareAppUsers = (o1: IAppUsers | null, o2: IAppUsers | null): boolean => this.appUsersService.compareAppUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mentees }) => {
      this.mentees = mentees;
      if (mentees) {
        this.updateForm(mentees);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mentees = this.menteesFormService.getMentees(this.editForm);
    if (mentees.id !== null) {
      this.subscribeToSaveResponse(this.menteesService.update(mentees));
    } else {
      this.subscribeToSaveResponse(this.menteesService.create(mentees));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMentees>>): void {
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

  protected updateForm(mentees: IMentees): void {
    this.mentees = mentees;
    this.menteesFormService.resetForm(this.editForm, mentees);

    this.userModulesSharedCollection = this.userModulesService.addUserModulesToCollectionIfMissing<IUserModules>(
      this.userModulesSharedCollection,
      mentees.module
    );
    this.appUsersSharedCollection = this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(
      this.appUsersSharedCollection,
      mentees.menteeUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userModulesService
      .query()
      .pipe(map((res: HttpResponse<IUserModules[]>) => res.body ?? []))
      .pipe(
        map((userModules: IUserModules[]) =>
          this.userModulesService.addUserModulesToCollectionIfMissing<IUserModules>(userModules, this.mentees?.module)
        )
      )
      .subscribe((userModules: IUserModules[]) => (this.userModulesSharedCollection = userModules));

    this.appUsersService
      .query()
      .pipe(map((res: HttpResponse<IAppUsers[]>) => res.body ?? []))
      .pipe(
        map((appUsers: IAppUsers[]) => this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(appUsers, this.mentees?.menteeUser))
      )
      .subscribe((appUsers: IAppUsers[]) => (this.appUsersSharedCollection = appUsers));
  }
}
