import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MentorsFormService } from './mentors-form.service';
import { MentorsService } from '../service/mentors.service';
import { IMentors } from '../mentors.model';
import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { UserModulesService } from 'app/entities/user-modules/service/user-modules.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

import { MentorsUpdateComponent } from './mentors-update.component';

describe('Mentors Management Update Component', () => {
  let comp: MentorsUpdateComponent;
  let fixture: ComponentFixture<MentorsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mentorsFormService: MentorsFormService;
  let mentorsService: MentorsService;
  let userModulesService: UserModulesService;
  let appUsersService: AppUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MentorsUpdateComponent],
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
      .overrideTemplate(MentorsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MentorsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mentorsFormService = TestBed.inject(MentorsFormService);
    mentorsService = TestBed.inject(MentorsService);
    userModulesService = TestBed.inject(UserModulesService);
    appUsersService = TestBed.inject(AppUsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserModules query and add missing value', () => {
      const mentors: IMentors = { id: 456 };
      const module: IUserModules = { id: 175 };
      mentors.module = module;

      const userModulesCollection: IUserModules[] = [{ id: 40223 }];
      jest.spyOn(userModulesService, 'query').mockReturnValue(of(new HttpResponse({ body: userModulesCollection })));
      const additionalUserModules = [module];
      const expectedCollection: IUserModules[] = [...additionalUserModules, ...userModulesCollection];
      jest.spyOn(userModulesService, 'addUserModulesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mentors });
      comp.ngOnInit();

      expect(userModulesService.query).toHaveBeenCalled();
      expect(userModulesService.addUserModulesToCollectionIfMissing).toHaveBeenCalledWith(
        userModulesCollection,
        ...additionalUserModules.map(expect.objectContaining)
      );
      expect(comp.userModulesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AppUsers query and add missing value', () => {
      const mentors: IMentors = { id: 456 };
      const mentorUser: IAppUsers = { id: 11835 };
      mentors.mentorUser = mentorUser;

      const appUsersCollection: IAppUsers[] = [{ id: 18972 }];
      jest.spyOn(appUsersService, 'query').mockReturnValue(of(new HttpResponse({ body: appUsersCollection })));
      const additionalAppUsers = [mentorUser];
      const expectedCollection: IAppUsers[] = [...additionalAppUsers, ...appUsersCollection];
      jest.spyOn(appUsersService, 'addAppUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mentors });
      comp.ngOnInit();

      expect(appUsersService.query).toHaveBeenCalled();
      expect(appUsersService.addAppUsersToCollectionIfMissing).toHaveBeenCalledWith(
        appUsersCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mentors: IMentors = { id: 456 };
      const module: IUserModules = { id: 16332 };
      mentors.module = module;
      const mentorUser: IAppUsers = { id: 63067 };
      mentors.mentorUser = mentorUser;

      activatedRoute.data = of({ mentors });
      comp.ngOnInit();

      expect(comp.userModulesSharedCollection).toContain(module);
      expect(comp.appUsersSharedCollection).toContain(mentorUser);
      expect(comp.mentors).toEqual(mentors);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentors>>();
      const mentors = { id: 123 };
      jest.spyOn(mentorsFormService, 'getMentors').mockReturnValue(mentors);
      jest.spyOn(mentorsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentors });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mentors }));
      saveSubject.complete();

      // THEN
      expect(mentorsFormService.getMentors).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mentorsService.update).toHaveBeenCalledWith(expect.objectContaining(mentors));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentors>>();
      const mentors = { id: 123 };
      jest.spyOn(mentorsFormService, 'getMentors').mockReturnValue({ id: null });
      jest.spyOn(mentorsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentors: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mentors }));
      saveSubject.complete();

      // THEN
      expect(mentorsFormService.getMentors).toHaveBeenCalled();
      expect(mentorsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMentors>>();
      const mentors = { id: 123 };
      jest.spyOn(mentorsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mentors });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mentorsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserModules', () => {
      it('Should forward to userModulesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userModulesService, 'compareUserModules');
        comp.compareUserModules(entity, entity2);
        expect(userModulesService.compareUserModules).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
