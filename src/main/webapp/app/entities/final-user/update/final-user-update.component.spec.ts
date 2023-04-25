import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FinalUserFormService } from './final-user-form.service';
import { FinalUserService } from '../service/final-user.service';
import { IFinalUser } from '../final-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FinalUserUpdateComponent } from './final-user-update.component';

describe('FinalUser Management Update Component', () => {
  let comp: FinalUserUpdateComponent;
  let fixture: ComponentFixture<FinalUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let finalUserFormService: FinalUserFormService;
  let finalUserService: FinalUserService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FinalUserUpdateComponent],
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
      .overrideTemplate(FinalUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinalUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    finalUserFormService = TestBed.inject(FinalUserFormService);
    finalUserService = TestBed.inject(FinalUserService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const finalUser: IFinalUser = { id: 456 };
      const user: IUser = { id: 78799 };
      finalUser.user = user;

      const userCollection: IUser[] = [{ id: 13938 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ finalUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const finalUser: IFinalUser = { id: 456 };
      const user: IUser = { id: 31781 };
      finalUser.user = user;

      activatedRoute.data = of({ finalUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.finalUser).toEqual(finalUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinalUser>>();
      const finalUser = { id: 123 };
      jest.spyOn(finalUserFormService, 'getFinalUser').mockReturnValue(finalUser);
      jest.spyOn(finalUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: finalUser }));
      saveSubject.complete();

      // THEN
      expect(finalUserFormService.getFinalUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(finalUserService.update).toHaveBeenCalledWith(expect.objectContaining(finalUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinalUser>>();
      const finalUser = { id: 123 };
      jest.spyOn(finalUserFormService, 'getFinalUser').mockReturnValue({ id: null });
      jest.spyOn(finalUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: finalUser }));
      saveSubject.complete();

      // THEN
      expect(finalUserFormService.getFinalUser).toHaveBeenCalled();
      expect(finalUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinalUser>>();
      const finalUser = { id: 123 };
      jest.spyOn(finalUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(finalUserService.update).toHaveBeenCalled();
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
