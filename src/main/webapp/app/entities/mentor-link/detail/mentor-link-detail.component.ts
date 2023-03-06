import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMentorLink } from '../mentor-link.model';

@Component({
  selector: 'jhi-mentor-link-detail',
  templateUrl: './mentor-link-detail.component.html',
})
export class MentorLinkDetailComponent implements OnInit {
  mentorLink: IMentorLink | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mentorLink }) => {
      this.mentorLink = mentorLink;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
