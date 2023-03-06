import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMentors } from '../mentors.model';

@Component({
  selector: 'jhi-mentors-detail',
  templateUrl: './mentors-detail.component.html',
})
export class MentorsDetailComponent implements OnInit {
  mentors: IMentors | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mentors }) => {
      this.mentors = mentors;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
