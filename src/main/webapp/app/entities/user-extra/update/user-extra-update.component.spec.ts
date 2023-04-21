import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserExtraFormService } from './user-extra-form.service';
import { UserExtraService } from '../service/user-extra.service';
import { IUserExtra } from '../user-extra.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserExtraUpdateComponent } from './user-extra-update.component';

describe('UserExtra Management Update Component', () => {
  let comp: UserExtraUpdateComponent;
  let fixture: ComponentFixture<UserExtraUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userExtraFormService: UserExtraFormService;
  let userExtraService: UserExtraService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserExtraUpdateComponent],
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
      .overrideTemplate(UserExtraUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserExtraUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userExtraFormService = TestBed.inject(UserExtraFormService);
    userExtraService = TestBed.inject(UserExtraService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userExtra: IUserExtra = { id: 456 };
      const user: IUser = { id: 71520 };
      userExtra.user = user;

      const userCollection: IUser[] = [{ id: 72997 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userExtra });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userExtra: IUserExtra = { id: 456 };
      const user: IUser = { id: 98618 };
      userExtra.user = user;

      activatedRoute.data = of({ userExtra });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.userExtra).toEqual(userExtra);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExtra>>();
      const userExtra = { id: 123 };
      jest.spyOn(userExtraFormService, 'getUserExtra').mockReturnValue(userExtra);
      jest.spyOn(userExtraService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtra });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExtra }));
      saveSubject.complete();

      // THEN
      expect(userExtraFormService.getUserExtra).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userExtraService.update).toHaveBeenCalledWith(expect.objectContaining(userExtra));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExtra>>();
      const userExtra = { id: 123 };
      jest.spyOn(userExtraFormService, 'getUserExtra').mockReturnValue({ id: null });
      jest.spyOn(userExtraService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtra: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userExtra }));
      saveSubject.complete();

      // THEN
      expect(userExtraFormService.getUserExtra).toHaveBeenCalled();
      expect(userExtraService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserExtra>>();
      const userExtra = { id: 123 };
      jest.spyOn(userExtraService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userExtra });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userExtraService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
