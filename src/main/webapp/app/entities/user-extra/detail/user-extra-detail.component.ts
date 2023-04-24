import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserExtra } from '../user-extra.model';

@Component({
  selector: 'jhi-user-extra-detail',
  templateUrl: './user-extra-detail.component.html',
})
export class UserExtraDetailComponent implements OnInit {
  userExtra: IUserExtra | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userExtra }) => {
      this.userExtra = userExtra;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
