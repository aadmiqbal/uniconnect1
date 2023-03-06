import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDegrees } from '../degrees.model';

@Component({
  selector: 'jhi-degrees-detail',
  templateUrl: './degrees-detail.component.html',
})
export class DegreesDetailComponent implements OnInit {
  degrees: IDegrees | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ degrees }) => {
      this.degrees = degrees;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
