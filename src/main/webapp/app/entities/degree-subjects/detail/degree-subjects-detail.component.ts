import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDegreeSubjects } from '../degree-subjects.model';

@Component({
  selector: 'jhi-degree-subjects-detail',
  templateUrl: './degree-subjects-detail.component.html',
})
export class DegreeSubjectsDetailComponent implements OnInit {
  degreeSubjects: IDegreeSubjects | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ degreeSubjects }) => {
      this.degreeSubjects = degreeSubjects;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
