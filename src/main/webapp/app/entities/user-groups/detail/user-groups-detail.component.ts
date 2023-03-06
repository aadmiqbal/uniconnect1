import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserGroups } from '../user-groups.model';

@Component({
  selector: 'jhi-user-groups-detail',
  templateUrl: './user-groups-detail.component.html',
})
export class UserGroupsDetailComponent implements OnInit {
  userGroups: IUserGroups | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userGroups }) => {
      this.userGroups = userGroups;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
