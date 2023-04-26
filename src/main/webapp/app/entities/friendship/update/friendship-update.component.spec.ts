import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FriendshipFormService } from './friendship-form.service';
import { FriendshipService } from '../service/friendship.service';
import { IFriendship } from '../friendship.model';
import { IFinalUser } from 'app/entities/final-user/final-user.model';
import { FinalUserService } from 'app/entities/final-user/service/final-user.service';

import { FriendshipUpdateComponent } from './friendship-update.component';

describe('Friendship Management Update Component', () => {
  let comp: FriendshipUpdateComponent;
  let fixture: ComponentFixture<FriendshipUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let friendshipFormService: FriendshipFormService;
  let friendshipService: FriendshipService;
  let finalUserService: FinalUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FriendshipUpdateComponent],
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
      .overrideTemplate(FriendshipUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FriendshipUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    friendshipFormService = TestBed.inject(FriendshipFormService);
    friendshipService = TestBed.inject(FriendshipService);
    finalUserService = TestBed.inject(FinalUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call FinalUser query and add missing value', () => {
      const friendship: IFriendship = { id: 456 };
      const finalUser: IFinalUser = { id: 20809 };
      friendship.finalUser = finalUser;
      const finalUser2: IFinalUser = { id: 28361 };
      friendship.finalUser2 = finalUser2;

      const finalUserCollection: IFinalUser[] = [{ id: 49495 }];
      jest.spyOn(finalUserService, 'query').mockReturnValue(of(new HttpResponse({ body: finalUserCollection })));
      const additionalFinalUsers = [finalUser, finalUser2];
      const expectedCollection: IFinalUser[] = [...additionalFinalUsers, ...finalUserCollection];
      jest.spyOn(finalUserService, 'addFinalUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ friendship });
      comp.ngOnInit();

      expect(finalUserService.query).toHaveBeenCalled();
      expect(finalUserService.addFinalUserToCollectionIfMissing).toHaveBeenCalledWith(
        finalUserCollection,
        ...additionalFinalUsers.map(expect.objectContaining)
      );
      expect(comp.finalUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const friendship: IFriendship = { id: 456 };
      const finalUser: IFinalUser = { id: 94087 };
      friendship.finalUser = finalUser;
      const finalUser2: IFinalUser = { id: 29073 };
      friendship.finalUser2 = finalUser2;

      activatedRoute.data = of({ friendship });
      comp.ngOnInit();

      expect(comp.finalUsersSharedCollection).toContain(finalUser);
      expect(comp.finalUsersSharedCollection).toContain(finalUser2);
      expect(comp.friendship).toEqual(friendship);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriendship>>();
      const friendship = { id: 123 };
      jest.spyOn(friendshipFormService, 'getFriendship').mockReturnValue(friendship);
      jest.spyOn(friendshipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friendship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: friendship }));
      saveSubject.complete();

      // THEN
      expect(friendshipFormService.getFriendship).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(friendshipService.update).toHaveBeenCalledWith(expect.objectContaining(friendship));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriendship>>();
      const friendship = { id: 123 };
      jest.spyOn(friendshipFormService, 'getFriendship').mockReturnValue({ id: null });
      jest.spyOn(friendshipService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friendship: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: friendship }));
      saveSubject.complete();

      // THEN
      expect(friendshipFormService.getFriendship).toHaveBeenCalled();
      expect(friendshipService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriendship>>();
      const friendship = { id: 123 };
      jest.spyOn(friendshipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friendship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(friendshipService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFinalUser', () => {
      it('Should forward to finalUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(finalUserService, 'compareFinalUser');
        comp.compareFinalUser(entity, entity2);
        expect(finalUserService.compareFinalUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
