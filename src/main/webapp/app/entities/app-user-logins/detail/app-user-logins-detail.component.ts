import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAppUserLogins } from '../app-user-logins.model';

@Component({
  selector: 'jhi-app-user-logins-detail',
  templateUrl: './app-user-logins-detail.component.html',
})
export class AppUserLoginsDetailComponent implements OnInit {
  appUserLogins: IAppUserLogins | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appUserLogins }) => {
      this.appUserLogins = appUserLogins;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
