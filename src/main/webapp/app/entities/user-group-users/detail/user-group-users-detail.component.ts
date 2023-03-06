import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserGroupUsers } from '../user-group-users.model';

@Component({
  selector: 'jhi-user-group-users-detail',
  templateUrl: './user-group-users-detail.component.html',
})
export class UserGroupUsersDetailComponent implements OnInit {
  userGroupUsers: IUserGroupUsers | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userGroupUsers }) => {
      this.userGroupUsers = userGroupUsers;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
