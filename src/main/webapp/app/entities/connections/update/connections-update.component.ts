import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ConnectionsFormService, ConnectionsFormGroup } from './connections-form.service';
import { IConnections } from '../connections.model';
import { ConnectionsService } from '../service/connections.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

@Component({
  selector: 'jhi-connections-update',
  templateUrl: './connections-update.component.html',
})
export class ConnectionsUpdateComponent implements OnInit {
  isSaving = false;
  connections: IConnections | null = null;

  appUsersSharedCollection: IAppUsers[] = [];

  editForm: ConnectionsFormGroup = this.connectionsFormService.createConnectionsFormGroup();

  constructor(
    protected connectionsService: ConnectionsService,
    protected connectionsFormService: ConnectionsFormService,
    protected appUsersService: AppUsersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAppUsers = (o1: IAppUsers | null, o2: IAppUsers | null): boolean => this.appUsersService.compareAppUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ connections }) => {
      this.connections = connections;
      if (connections) {
        this.updateForm(connections);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const connections = this.connectionsFormService.getConnections(this.editForm);
    if (connections.id !== null) {
      this.subscribeToSaveResponse(this.connectionsService.update(connections));
    } else {
      this.subscribeToSaveResponse(this.connectionsService.create(connections));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConnections>>): void {
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

  protected updateForm(connections: IConnections): void {
    this.connections = connections;
    this.connectionsFormService.resetForm(this.editForm, connections);

    this.appUsersSharedCollection = this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(
      this.appUsersSharedCollection,
      connections.user1,
      connections.user2
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appUsersService
      .query()
      .pipe(map((res: HttpResponse<IAppUsers[]>) => res.body ?? []))
      .pipe(
        map((appUsers: IAppUsers[]) =>
          this.appUsersService.addAppUsersToCollectionIfMissing<IAppUsers>(appUsers, this.connections?.user1, this.connections?.user2)
        )
      )
      .subscribe((appUsers: IAppUsers[]) => (this.appUsersSharedCollection = appUsers));
  }
}
