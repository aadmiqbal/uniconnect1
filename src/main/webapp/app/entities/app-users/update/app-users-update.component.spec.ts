import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AppUsersFormService } from './app-users-form.service';
import { AppUsersService } from '../service/app-users.service';
import { IAppUsers } from '../app-users.model';
import { IDegrees } from 'app/entities/degrees/degrees.model';
import { DegreesService } from 'app/entities/degrees/service/degrees.service';

import { AppUsersUpdateComponent } from './app-users-update.component';

describe('AppUsers Management Update Component', () => {
  let comp: AppUsersUpdateComponent;
  let fixture: ComponentFixture<AppUsersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let appUsersFormService: AppUsersFormService;
  let appUsersService: AppUsersService;
  let degreesService: DegreesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AppUsersUpdateComponent],
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
      .overrideTemplate(AppUsersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppUsersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appUsersFormService = TestBed.inject(AppUsersFormService);
    appUsersService = TestBed.inject(AppUsersService);
    degreesService = TestBed.inject(DegreesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Degrees query and add missing value', () => {
      const appUsers: IAppUsers = { id: 456 };
      const subject: IDegrees = { id: 15648 };
      appUsers.subject = subject;

      const degreesCollection: IDegrees[] = [{ id: 55106 }];
      jest.spyOn(degreesService, 'query').mockReturnValue(of(new HttpResponse({ body: degreesCollection })));
      const additionalDegrees = [subject];
      const expectedCollection: IDegrees[] = [...additionalDegrees, ...degreesCollection];
      jest.spyOn(degreesService, 'addDegreesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appUsers });
      comp.ngOnInit();

      expect(degreesService.query).toHaveBeenCalled();
      expect(degreesService.addDegreesToCollectionIfMissing).toHaveBeenCalledWith(
        degreesCollection,
        ...additionalDegrees.map(expect.objectContaining)
      );
      expect(comp.degreesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const appUsers: IAppUsers = { id: 456 };
      const subject: IDegrees = { id: 80230 };
      appUsers.subject = subject;

      activatedRoute.data = of({ appUsers });
      comp.ngOnInit();

      expect(comp.degreesSharedCollection).toContain(subject);
      expect(comp.appUsers).toEqual(appUsers);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUsers>>();
      const appUsers = { id: 123 };
      jest.spyOn(appUsersFormService, 'getAppUsers').mockReturnValue(appUsers);
      jest.spyOn(appUsersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUsers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appUsers }));
      saveSubject.complete();

      // THEN
      expect(appUsersFormService.getAppUsers).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(appUsersService.update).toHaveBeenCalledWith(expect.objectContaining(appUsers));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUsers>>();
      const appUsers = { id: 123 };
      jest.spyOn(appUsersFormService, 'getAppUsers').mockReturnValue({ id: null });
      jest.spyOn(appUsersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUsers: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appUsers }));
      saveSubject.complete();

      // THEN
      expect(appUsersFormService.getAppUsers).toHaveBeenCalled();
      expect(appUsersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppUsers>>();
      const appUsers = { id: 123 };
      jest.spyOn(appUsersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appUsers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appUsersService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDegrees', () => {
      it('Should forward to degreesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(degreesService, 'compareDegrees');
        comp.compareDegrees(entity, entity2);
        expect(degreesService.compareDegrees).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
