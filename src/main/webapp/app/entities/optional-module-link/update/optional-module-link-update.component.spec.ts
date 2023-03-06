import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OptionalModuleLinkFormService } from './optional-module-link-form.service';
import { OptionalModuleLinkService } from '../service/optional-module-link.service';
import { IOptionalModuleLink } from '../optional-module-link.model';
import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { UserModulesService } from 'app/entities/user-modules/service/user-modules.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

import { OptionalModuleLinkUpdateComponent } from './optional-module-link-update.component';

describe('OptionalModuleLink Management Update Component', () => {
  let comp: OptionalModuleLinkUpdateComponent;
  let fixture: ComponentFixture<OptionalModuleLinkUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let optionalModuleLinkFormService: OptionalModuleLinkFormService;
  let optionalModuleLinkService: OptionalModuleLinkService;
  let userModulesService: UserModulesService;
  let appUsersService: AppUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OptionalModuleLinkUpdateComponent],
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
      .overrideTemplate(OptionalModuleLinkUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OptionalModuleLinkUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    optionalModuleLinkFormService = TestBed.inject(OptionalModuleLinkFormService);
    optionalModuleLinkService = TestBed.inject(OptionalModuleLinkService);
    userModulesService = TestBed.inject(UserModulesService);
    appUsersService = TestBed.inject(AppUsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserModules query and add missing value', () => {
      const optionalModuleLink: IOptionalModuleLink = { id: 456 };
      const optionalModule: IUserModules = { id: 26356 };
      optionalModuleLink.optionalModule = optionalModule;

      const userModulesCollection: IUserModules[] = [{ id: 2236 }];
      jest.spyOn(userModulesService, 'query').mockReturnValue(of(new HttpResponse({ body: userModulesCollection })));
      const additionalUserModules = [optionalModule];
      const expectedCollection: IUserModules[] = [...additionalUserModules, ...userModulesCollection];
      jest.spyOn(userModulesService, 'addUserModulesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ optionalModuleLink });
      comp.ngOnInit();

      expect(userModulesService.query).toHaveBeenCalled();
      expect(userModulesService.addUserModulesToCollectionIfMissing).toHaveBeenCalledWith(
        userModulesCollection,
        ...additionalUserModules.map(expect.objectContaining)
      );
      expect(comp.userModulesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AppUsers query and add missing value', () => {
      const optionalModuleLink: IOptionalModuleLink = { id: 456 };
      const optionalModuleUser: IAppUsers = { id: 62137 };
      optionalModuleLink.optionalModuleUser = optionalModuleUser;

      const appUsersCollection: IAppUsers[] = [{ id: 89547 }];
      jest.spyOn(appUsersService, 'query').mockReturnValue(of(new HttpResponse({ body: appUsersCollection })));
      const additionalAppUsers = [optionalModuleUser];
      const expectedCollection: IAppUsers[] = [...additionalAppUsers, ...appUsersCollection];
      jest.spyOn(appUsersService, 'addAppUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ optionalModuleLink });
      comp.ngOnInit();

      expect(appUsersService.query).toHaveBeenCalled();
      expect(appUsersService.addAppUsersToCollectionIfMissing).toHaveBeenCalledWith(
        appUsersCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const optionalModuleLink: IOptionalModuleLink = { id: 456 };
      const optionalModule: IUserModules = { id: 40837 };
      optionalModuleLink.optionalModule = optionalModule;
      const optionalModuleUser: IAppUsers = { id: 40738 };
      optionalModuleLink.optionalModuleUser = optionalModuleUser;

      activatedRoute.data = of({ optionalModuleLink });
      comp.ngOnInit();

      expect(comp.userModulesSharedCollection).toContain(optionalModule);
      expect(comp.appUsersSharedCollection).toContain(optionalModuleUser);
      expect(comp.optionalModuleLink).toEqual(optionalModuleLink);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOptionalModuleLink>>();
      const optionalModuleLink = { id: 123 };
      jest.spyOn(optionalModuleLinkFormService, 'getOptionalModuleLink').mockReturnValue(optionalModuleLink);
      jest.spyOn(optionalModuleLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ optionalModuleLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: optionalModuleLink }));
      saveSubject.complete();

      // THEN
      expect(optionalModuleLinkFormService.getOptionalModuleLink).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(optionalModuleLinkService.update).toHaveBeenCalledWith(expect.objectContaining(optionalModuleLink));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOptionalModuleLink>>();
      const optionalModuleLink = { id: 123 };
      jest.spyOn(optionalModuleLinkFormService, 'getOptionalModuleLink').mockReturnValue({ id: null });
      jest.spyOn(optionalModuleLinkService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ optionalModuleLink: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: optionalModuleLink }));
      saveSubject.complete();

      // THEN
      expect(optionalModuleLinkFormService.getOptionalModuleLink).toHaveBeenCalled();
      expect(optionalModuleLinkService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOptionalModuleLink>>();
      const optionalModuleLink = { id: 123 };
      jest.spyOn(optionalModuleLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ optionalModuleLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(optionalModuleLinkService.update).toHaveBeenCalled();
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
