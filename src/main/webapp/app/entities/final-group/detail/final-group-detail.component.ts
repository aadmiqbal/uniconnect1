import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinalGroup } from '../final-group.model';

@Component({
  selector: 'jhi-final-group-detail',
  templateUrl: './final-group-detail.component.html',
})
export class FinalGroupDetailComponent implements OnInit {
  finalGroup: IFinalGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finalGroup }) => {
      this.finalGroup = finalGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
