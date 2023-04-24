import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinalUser } from '../final-user.model';

@Component({
  selector: 'jhi-final-user-detail',
  templateUrl: './final-user-detail.component.html',
})
export class FinalUserDetailComponent implements OnInit {
  finalUser: IFinalUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finalUser }) => {
      this.finalUser = finalUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
