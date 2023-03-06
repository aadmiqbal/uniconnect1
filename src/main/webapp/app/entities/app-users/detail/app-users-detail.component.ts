import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAppUsers } from '../app-users.model';

@Component({
  selector: 'jhi-app-users-detail',
  templateUrl: './app-users-detail.component.html',
})
export class AppUsersDetailComponent implements OnInit {
  appUsers: IAppUsers | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUsers }) => {
      this.appUsers = appUsers;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
