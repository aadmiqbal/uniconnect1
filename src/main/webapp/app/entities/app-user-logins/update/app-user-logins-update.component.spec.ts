import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AppUserLoginsFormService } from './app-user-logins-form.service';
import { AppUserLoginsService } from '../service/app-user-logins.service';
import { IAppUserLogins } from '../app-user-logins.model';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

import { AppUserLoginsUpdateComponent } from './app-user-logins-update.component';

describe('AppUserLogins Management Update Component', () => {
  let comp: AppUserLoginsUpdateComponent;
  let fixture: ComponentFixture<AppUserLoginsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let appUserLoginsFormService: AppUserLoginsFormService;
  let appUserLoginsService: AppUserLoginsService;
  let appUsersService: AppUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AppUserLoginsUpdateComponent],
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
      .overrideTemplate(AppUserLoginsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppUserLoginsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appUserLoginsFormService = TestBed.inject(AppUserLoginsFormService);
    appUserLoginsService = TestBed.inject(AppUserLoginsService);
    appUsersService = TestBed.inject(AppUsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AppUsers query and add missing value', () => {
      const appUserLogins: IAppUserLogins = { id: 456 };
      const appUser: IAppUsers = { id: 67369 };
      appUserLogins.appUser = appUser;

      const appUsersCollection: IAppUsers[] = [{ id: 53721 }];
      jest.spyOn(appUsersService, 'query').mockReturnValue(of(new HttpResponse({ body: appUsersCollection })));
      const additionalAppUsers = [appUser];
      const expectedCollection: IAppUsers[] = [...additionalAppUsers, ...appUsersCollection];
      jest.spyOn(appUsersService, 'addAppUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appUserLogins });
      comp.ngOnInit();

      expect(appUsersService.query).toHaveBeenCalled();
      expect(appUsersService.addAppUsersToCollectionIfMissing).toHaveBeenCalledWith(
        appUsersCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const appUserLogins: IAppUserLogins = { id: 456 };
      const appUser: IAppUsers = { id: 86189 };
      appUserLogins.appUser = appUser;

      activatedRoute.data = of({ appUserLogins });
      comp.ngOnInit();

      expect(comp.appUsersSharedCollection).toContain(appUser);
      expect(comp.appUserLogins).toEqual(appUserLogins);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUserLogins>>();
      const appUserLogins = { id: 123 };
      jest.spyOn(appUserLoginsFormService, 'getAppUserLogins').mockReturnValue(appUserLogins);
      jest.spyOn(appUserLoginsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUserLogins });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appUserLogins }));
      saveSubject.complete();

      // THEN
      expect(appUserLoginsFormService.getAppUserLogins).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(appUserLoginsService.update).toHaveBeenCalledWith(expect.objectContaining(appUserLogins));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUserLogins>>();
      const appUserLogins = { id: 123 };
      jest.spyOn(appUserLoginsFormService, 'getAppUserLogins').mockReturnValue({ id: null });
      jest.spyOn(appUserLoginsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUserLogins: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appUserLogins }));
      saveSubject.complete();

      // THEN
      expect(appUserLoginsFormService.getAppUserLogins).toHaveBeenCalled();
      expect(appUserLoginsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUserLogins>>();
      const appUserLogins = { id: 123 };
      jest.spyOn(appUserLoginsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUserLogins });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appUserLoginsService.update).toHaveBeenCalled();
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
