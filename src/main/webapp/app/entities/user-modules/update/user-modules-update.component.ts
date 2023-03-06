import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UserModulesFormService, UserModulesFormGroup } from './user-modules-form.service';
import { IUserModules } from '../user-modules.model';
import { UserModulesService } from '../service/user-modules.service';

@Component({
  selector: 'jhi-user-modules-update',
  templateUrl: './user-modules-update.component.html',
})
export class UserModulesUpdateComponent implements OnInit {
  isSaving = false;
  userModules: IUserModules | null = null;

  editForm: UserModulesFormGroup = this.userModulesFormService.createUserModulesFormGroup();

  constructor(
    protected userModulesService: UserModulesService,
    protected userModulesFormService: UserModulesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userModules }) => {
      this.userModules = userModules;
      if (userModules) {
        this.updateForm(userModules);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userModules = this.userModulesFormService.getUserModules(this.editForm);
    if (userModules.id !== null) {
      this.subscribeToSaveResponse(this.userModulesService.update(userModules));
    } else {
      this.subscribeToSaveResponse(this.userModulesService.create(userModules));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserModules>>): void {
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

  protected updateForm(userModules: IUserModules): void {
    this.userModules = userModules;
    this.userModulesFormService.resetForm(this.editForm, userModules);
  }
}
