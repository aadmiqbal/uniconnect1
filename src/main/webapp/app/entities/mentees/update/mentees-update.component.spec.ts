import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MenteesFormService } from './mentees-form.service';
import { MenteesService } from '../service/mentees.service';
import { IMentees } from '../mentees.model';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

import { MenteesUpdateComponent } from './mentees-update.component';

describe('Mentees Management Update Component', () => {
  let comp: MenteesUpdateComponent;
  let fixture: ComponentFixture<MenteesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let menteesFormService: MenteesFormService;
  let menteesService: MenteesService;
  let appUsersService: AppUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MenteesUpdateComponent],
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
      .overrideTemplate(MenteesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MenteesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    menteesFormService = TestBed.inject(MenteesFormService);
    menteesService = TestBed.inject(MenteesService);
    appUsersService = TestBed.inject(AppUsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AppUsers query and add missing value', () => {
      const mentees: IMentees = { id: 456 };
      const menteeUser: IAppUsers = { id: 24010 };
      mentees.menteeUser = menteeUser;

      const appUsersCollection: IAppUsers[] = [{ id: 17631 }];
      jest.spyOn(appUsersService, 'query').mockReturnValue(of(new HttpResponse({ body: appUsersCollection })));
      const additionalAppUsers = [menteeUser];
      const expectedCollection: IAppUsers[] = [...additionalAppUsers, ...appUsersCollection];
      jest.spyOn(appUsersService, 'addAppUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mentees });
      comp.ngOnInit();

      expect(appUsersService.query).toHaveBeenCalled();
      expect(appUsersService.addAppUsersToCollectionIfMissing).toHaveBeenCalledWith(
        appUsersCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mentees: IMentees = { id: 456 };
      const menteeUser: IAppUsers = { id: 43619 };
      mentees.menteeUser = menteeUser;

      activatedRoute.data = of({ mentees });
      comp.ngOnInit();

      expect(comp.appUsersSharedCollection).toContain(menteeUser);
      expect(comp.mentees).toEqual(mentees);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentees>>();
      const mentees = { id: 123 };
      jest.spyOn(menteesFormService, 'getMentees').mockReturnValue(mentees);
      jest.spyOn(menteesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentees });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mentees }));
      saveSubject.complete();

      // THEN
      expect(menteesFormService.getMentees).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(menteesService.update).toHaveBeenCalledWith(expect.objectContaining(mentees));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentees>>();
      const mentees = { id: 123 };
      jest.spyOn(menteesFormService, 'getMentees').mockReturnValue({ id: null });
      jest.spyOn(menteesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentees: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mentees }));
      saveSubject.complete();

      // THEN
      expect(menteesFormService.getMentees).toHaveBeenCalled();
      expect(menteesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentees>>();
      const mentees = { id: 123 };
      jest.spyOn(menteesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentees });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(menteesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAppUsers', () => {
      it('Should forward to appUsersService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(appUsersService, 'compareAppUsers');
        comp.compareAppUsers(entity, entity2);
        expect(appUsersService.compareAppUsers).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
