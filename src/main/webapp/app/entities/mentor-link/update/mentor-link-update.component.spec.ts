import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MentorLinkFormService } from './mentor-link-form.service';
import { MentorLinkService } from '../service/mentor-link.service';
import { IMentorLink } from '../mentor-link.model';
import { IMentors } from 'app/entities/mentors/mentors.model';
import { MentorsService } from 'app/entities/mentors/service/mentors.service';
import { IMentees } from 'app/entities/mentees/mentees.model';
import { MenteesService } from 'app/entities/mentees/service/mentees.service';

import { MentorLinkUpdateComponent } from './mentor-link-update.component';

describe('MentorLink Management Update Component', () => {
  let comp: MentorLinkUpdateComponent;
  let fixture: ComponentFixture<MentorLinkUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mentorLinkFormService: MentorLinkFormService;
  let mentorLinkService: MentorLinkService;
  let mentorsService: MentorsService;
  let menteesService: MenteesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MentorLinkUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MentorLinkUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MentorLinkUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mentorLinkFormService = TestBed.inject(MentorLinkFormService);
    mentorLinkService = TestBed.inject(MentorLinkService);
    mentorsService = TestBed.inject(MentorsService);
    menteesService = TestBed.inject(MenteesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Mentors query and add missing value', () => {
      const mentorLink: IMentorLink = { id: 456 };
      const mentor: IMentors = { id: 66742 };
      mentorLink.mentor = mentor;

      const mentorsCollection: IMentors[] = [{ id: 60064 }];
      jest.spyOn(mentorsService, 'query').mockReturnValue(of(new HttpResponse({ body: mentorsCollection })));
      const additionalMentors = [mentor];
      const expectedCollection: IMentors[] = [...additionalMentors, ...mentorsCollection];
      jest.spyOn(mentorsService, 'addMentorsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mentorLink });
      comp.ngOnInit();

      expect(mentorsService.query).toHaveBeenCalled();
      expect(mentorsService.addMentorsToCollectionIfMissing).toHaveBeenCalledWith(
        mentorsCollection,
        ...additionalMentors.map(expect.objectContaining)
      );
      expect(comp.mentorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Mentees query and add missing value', () => {
      const mentorLink: IMentorLink = { id: 456 };
      const mentee: IMentees = { id: 61885 };
      mentorLink.mentee = mentee;

      const menteesCollection: IMentees[] = [{ id: 91926 }];
      jest.spyOn(menteesService, 'query').mockReturnValue(of(new HttpResponse({ body: menteesCollection })));
      const additionalMentees = [mentee];
      const expectedCollection: IMentees[] = [...additionalMentees, ...menteesCollection];
      jest.spyOn(menteesService, 'addMenteesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mentorLink });
      comp.ngOnInit();

      expect(menteesService.query).toHaveBeenCalled();
      expect(menteesService.addMenteesToCollectionIfMissing).toHaveBeenCalledWith(
        menteesCollection,
        ...additionalMentees.map(expect.objectContaining)
      );
      expect(comp.menteesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mentorLink: IMentorLink = { id: 456 };
      const mentor: IMentors = { id: 72019 };
      mentorLink.mentor = mentor;
      const mentee: IMentees = { id: 91606 };
      mentorLink.mentee = mentee;

      activatedRoute.data = of({ mentorLink });
      comp.ngOnInit();

      expect(comp.mentorsSharedCollection).toContain(mentor);
      expect(comp.menteesSharedCollection).toContain(mentee);
      expect(comp.mentorLink).toEqual(mentorLink);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentorLink>>();
      const mentorLink = { id: 123 };
      jest.spyOn(mentorLinkFormService, 'getMentorLink').mockReturnValue(mentorLink);
      jest.spyOn(mentorLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentorLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mentorLink }));
      saveSubject.complete();

      // THEN
      expect(mentorLinkFormService.getMentorLink).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mentorLinkService.update).toHaveBeenCalledWith(expect.objectContaining(mentorLink));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentorLink>>();
      const mentorLink = { id: 123 };
      jest.spyOn(mentorLinkFormService, 'getMentorLink').mockReturnValue({ id: null });
      jest.spyOn(mentorLinkService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentorLink: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mentorLink }));
      saveSubject.complete();

      // THEN
      expect(mentorLinkFormService.getMentorLink).toHaveBeenCalled();
      expect(mentorLinkService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentorLink>>();
      const mentorLink = { id: 123 };
      jest.spyOn(mentorLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentorLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mentorLinkService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMentors', () => {
      it('Should forward to mentorsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(mentorsService, 'compareMentors');
        comp.compareMentors(entity, entity2);
        expect(mentorsService.compareMentors).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMentees', () => {
      it('Should forward to menteesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(menteesService, 'compareMentees');
        comp.compareMentees(entity, entity2);
        expect(menteesService.compareMentees).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
