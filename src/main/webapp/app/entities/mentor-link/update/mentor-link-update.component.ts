import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MentorLinkFormService, MentorLinkFormGroup } from './mentor-link-form.service';
import { IMentorLink } from '../mentor-link.model';
import { MentorLinkService } from '../service/mentor-link.service';
import { IMentors } from 'app/entities/mentors/mentors.model';
import { MentorsService } from 'app/entities/mentors/service/mentors.service';
import { IMentees } from 'app/entities/mentees/mentees.model';
import { MenteesService } from 'app/entities/mentees/service/mentees.service';

@Component({
  selector: 'jhi-mentor-link-update',
  templateUrl: './mentor-link-update.component.html',
})
export class MentorLinkUpdateComponent implements OnInit {
  isSaving = false;
  mentorLink: IMentorLink | null = null;

  mentorsSharedCollection: IMentors[] = [];
  menteesSharedCollection: IMentees[] = [];

  editForm: MentorLinkFormGroup = this.mentorLinkFormService.createMentorLinkFormGroup();

  constructor(
    protected mentorLinkService: MentorLinkService,
    protected mentorLinkFormService: MentorLinkFormService,
    protected mentorsService: MentorsService,
    protected menteesService: MenteesService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMentors = (o1: IMentors | null, o2: IMentors | null): boolean => this.mentorsService.compareMentors(o1, o2);

  compareMentees = (o1: IMentees | null, o2: IMentees | null): boolean => this.menteesService.compareMentees(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mentorLink }) => {
      this.mentorLink = mentorLink;
      if (mentorLink) {
        this.updateForm(mentorLink);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mentorLink = this.mentorLinkFormService.getMentorLink(this.editForm);
    if (mentorLink.id !== null) {
      this.subscribeToSaveResponse(this.mentorLinkService.update(mentorLink));
    } else {
      this.subscribeToSaveResponse(this.mentorLinkService.create(mentorLink));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMentorLink>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(mentorLink: IMentorLink): void {
    this.mentorLink = mentorLink;
    this.mentorLinkFormService.resetForm(this.editForm, mentorLink);

    this.mentorsSharedCollection = this.mentorsService.addMentorsToCollectionIfMissing<IMentors>(
      this.mentorsSharedCollection,
      mentorLink.mentor
    );
    this.menteesSharedCollection = this.menteesService.addMenteesToCollectionIfMissing<IMentees>(
      this.menteesSharedCollection,
      mentorLink.mentee
    );
  }

  protected loadRelationshipsOptions(): void {
    this.mentorsService
      .query()
      .pipe(map((res: HttpResponse<IMentors[]>) => res.body ?? []))
      .pipe(map((mentors: IMentors[]) => this.mentorsService.addMentorsToCollectionIfMissing<IMentors>(mentors, this.mentorLink?.mentor)))
      .subscribe((mentors: IMentors[]) => (this.mentorsSharedCollection = mentors));

    this.menteesService
      .query()
      .pipe(map((res: HttpResponse<IMentees[]>) => res.body ?? []))
      .pipe(map((mentees: IMentees[]) => this.menteesService.addMenteesToCollectionIfMissing<IMentees>(mentees, this.mentorLink?.mentee)))
      .subscribe((mentees: IMentees[]) => (this.menteesSharedCollection = mentees));
  }
}
