import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserGroupAdFormService } from './user-group-ad-form.service';
import { UserGroupAdService } from '../service/user-group-ad.service';
import { IUserGroupAd } from '../user-group-ad.model';
import { IUserGroups } from 'app/entities/user-groups/user-groups.model';
import { UserGroupsService } from 'app/entities/user-groups/service/user-groups.service';

import { UserGroupAdUpdateComponent } from './user-group-ad-update.component';

describe('UserGroupAd Management Update Component', () => {
  let comp: UserGroupAdUpdateComponent;
  let fixture: ComponentFixture<UserGroupAdUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userGroupAdFormService: UserGroupAdFormService;
  let userGroupAdService: UserGroupAdService;
  let userGroupsService: UserGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserGroupAdUpdateComponent],
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
      .overrideTemplate(UserGroupAdUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserGroupAdUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userGroupAdFormService = TestBed.inject(UserGroupAdFormService);
    userGroupAdService = TestBed.inject(UserGroupAdService);
    userGroupsService = TestBed.inject(UserGroupsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserGroups query and add missing value', () => {
      const userGroupAd: IUserGroupAd = { id: 456 };
      const group: IUserGroups = { id: 30230 };
      userGroupAd.group = group;

      const userGroupsCollection: IUserGroups[] = [{ id: 74107 }];
      jest.spyOn(userGroupsService, 'query').mockReturnValue(of(new HttpResponse({ body: userGroupsCollection })));
      const additionalUserGroups = [group];
      const expectedCollection: IUserGroups[] = [...additionalUserGroups, ...userGroupsCollection];
      jest.spyOn(userGroupsService, 'addUserGroupsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupAd });
      comp.ngOnInit();

      expect(userGroupsService.query).toHaveBeenCalled();
      expect(userGroupsService.addUserGroupsToCollectionIfMissing).toHaveBeenCalledWith(
        userGroupsCollection,
        ...additionalUserGroups.map(expect.objectContaining)
      );
      expect(comp.userGroupsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userGroupAd: IUserGroupAd = { id: 456 };
      const group: IUserGroups = { id: 89337 };
      userGroupAd.group = group;

      activatedRoute.data = of({ userGroupAd });
      comp.ngOnInit();

      expect(comp.userGroupsSharedCollection).toContain(group);
      expect(comp.userGroupAd).toEqual(userGroupAd);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupAd>>();
      const userGroupAd = { id: 123 };
      jest.spyOn(userGroupAdFormService, 'getUserGroupAd').mockReturnValue(userGroupAd);
      jest.spyOn(userGroupAdService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupAd });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroupAd }));
      saveSubject.complete();

      // THEN
      expect(userGroupAdFormService.getUserGroupAd).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userGroupAdService.update).toHaveBeenCalledWith(expect.objectContaining(userGroupAd));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupAd>>();
      const userGroupAd = { id: 123 };
      jest.spyOn(userGroupAdFormService, 'getUserGroupAd').mockReturnValue({ id: null });
      jest.spyOn(userGroupAdService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupAd: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroupAd }));
      saveSubject.complete();

      // THEN
      expect(userGroupAdFormService.getUserGroupAd).toHaveBeenCalled();
      expect(userGroupAdService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupAd>>();
      const userGroupAd = { id: 123 };
      jest.spyOn(userGroupAdService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupAd });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userGroupAdService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserGroups', () => {
      it('Should forward to userGroupsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userGroupsService, 'compareUserGroups');
        comp.compareUserGroups(entity, entity2);
        expect(userGroupsService.compareUserGroups).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
