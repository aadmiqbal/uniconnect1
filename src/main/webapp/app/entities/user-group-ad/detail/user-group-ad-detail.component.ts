import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserGroupAd } from '../user-group-ad.model';

@Component({
  selector: 'jhi-user-group-ad-detail',
  templateUrl: './user-group-ad-detail.component.html',
})
export class UserGroupAdDetailComponent implements OnInit {
  userGroupAd: IUserGroupAd | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userGroupAd }) => {
      this.userGroupAd = userGroupAd;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
