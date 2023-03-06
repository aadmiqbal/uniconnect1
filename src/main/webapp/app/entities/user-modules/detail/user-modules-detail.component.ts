import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserModules } from '../user-modules.model';

@Component({
  selector: 'jhi-user-modules-detail',
  templateUrl: './user-modules-detail.component.html',
})
export class UserModulesDetailComponent implements OnInit {
  userModules: IUserModules | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userModules }) => {
      this.userModules = userModules;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
