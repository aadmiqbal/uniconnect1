import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ModuleLinkFormService } from './module-link-form.service';
import { ModuleLinkService } from '../service/module-link.service';
import { IModuleLink } from '../module-link.model';
import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { UserModulesService } from 'app/entities/user-modules/service/user-modules.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

import { ModuleLinkUpdateComponent } from './module-link-update.component';

describe('ModuleLink Management Update Component', () => {
  let comp: ModuleLinkUpdateComponent;
  let fixture: ComponentFixture<ModuleLinkUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moduleLinkFormService: ModuleLinkFormService;
  let moduleLinkService: ModuleLinkService;
  let userModulesService: UserModulesService;
  let appUsersService: AppUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ModuleLinkUpdateComponent],
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
      .overrideTemplate(ModuleLinkUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModuleLinkUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    moduleLinkFormService = TestBed.inject(ModuleLinkFormService);
    moduleLinkService = TestBed.inject(ModuleLinkService);
    userModulesService = TestBed.inject(UserModulesService);
    appUsersService = TestBed.inject(AppUsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserModules query and add missing value', () => {
      const moduleLink: IModuleLink = { id: 456 };
      const optionalModule: IUserModules = { id: 58917 };
      moduleLink.optionalModule = optionalModule;

      const userModulesCollection: IUserModules[] = [{ id: 57022 }];
      jest.spyOn(userModulesService, 'query').mockReturnValue(of(new HttpResponse({ body: userModulesCollection })));
      const additionalUserModules = [optionalModule];
      const expectedCollection: IUserModules[] = [...additionalUserModules, ...userModulesCollection];
      jest.spyOn(userModulesService, 'addUserModulesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ moduleLink });
      comp.ngOnInit();

      expect(userModulesService.query).toHaveBeenCalled();
      expect(userModulesService.addUserModulesToCollectionIfMissing).toHaveBeenCalledWith(
        userModulesCollection,
        ...additionalUserModules.map(expect.objectContaining)
      );
      expect(comp.userModulesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AppUsers query and add missing value', () => {
      const moduleLink: IModuleLink = { id: 456 };
      const optionalModuleUser: IAppUsers = { id: 11873 };
      moduleLink.optionalModuleUser = optionalModuleUser;

      const appUsersCollection: IAppUsers[] = [{ id: 6622 }];
      jest.spyOn(appUsersService, 'query').mockReturnValue(of(new HttpResponse({ body: appUsersCollection })));
      const additionalAppUsers = [optionalModuleUser];
      const expectedCollection: IAppUsers[] = [...additionalAppUsers, ...appUsersCollection];
      jest.spyOn(appUsersService, 'addAppUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ moduleLink });
      comp.ngOnInit();

      expect(appUsersService.query).toHaveBeenCalled();
      expect(appUsersService.addAppUsersToCollectionIfMissing).toHaveBeenCalledWith(
        appUsersCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const moduleLink: IModuleLink = { id: 456 };
      const optionalModule: IUserModules = { id: 82264 };
      moduleLink.optionalModule = optionalModule;
      const optionalModuleUser: IAppUsers = { id: 29520 };
      moduleLink.optionalModuleUser = optionalModuleUser;

      activatedRoute.data = of({ moduleLink });
      comp.ngOnInit();

      expect(comp.userModulesSharedCollection).toContain(optionalModule);
      expect(comp.appUsersSharedCollection).toContain(optionalModuleUser);
      expect(comp.moduleLink).toEqual(moduleLink);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModuleLink>>();
      const moduleLink = { id: 123 };
      jest.spyOn(moduleLinkFormService, 'getModuleLink').mockReturnValue(moduleLink);
      jest.spyOn(moduleLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moduleLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: moduleLink }));
      saveSubject.complete();

      // THEN
      expect(moduleLinkFormService.getModuleLink).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(moduleLinkService.update).toHaveBeenCalledWith(expect.objectContaining(moduleLink));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModuleLink>>();
      const moduleLink = { id: 123 };
      jest.spyOn(moduleLinkFormService, 'getModuleLink').mockReturnValue({ id: null });
      jest.spyOn(moduleLinkService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moduleLink: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: moduleLink }));
      saveSubject.complete();

      // THEN
      expect(moduleLinkFormService.getModuleLink).toHaveBeenCalled();
      expect(moduleLinkService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModuleLink>>();
      const moduleLink = { id: 123 };
      jest.spyOn(moduleLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moduleLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(moduleLinkService.update).toHaveBeenCalled();
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
