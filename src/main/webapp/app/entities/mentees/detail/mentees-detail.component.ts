import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMentees } from '../mentees.model';

@Component({
  selector: 'jhi-mentees-detail',
  templateUrl: './mentees-detail.component.html',
})
export class MenteesDetailComponent implements OnInit {
  mentees: IMentees | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mentees }) => {
      this.mentees = mentees;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
