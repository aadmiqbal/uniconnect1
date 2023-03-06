import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISubjects } from '../subjects.model';

@Component({
  selector: 'jhi-subjects-detail',
  templateUrl: './subjects-detail.component.html',
})
export class SubjectsDetailComponent implements OnInit {
  subjects: ISubjects | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subjects }) => {
      this.subjects = subjects;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
