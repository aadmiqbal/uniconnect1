import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserGroupUsersFormService } from './user-group-users-form.service';
import { UserGroupUsersService } from '../service/user-group-users.service';
import { IUserGroupUsers } from '../user-group-users.model';
import { IUserGroups } from 'app/entities/user-groups/user-groups.model';
import { UserGroupsService } from 'app/entities/user-groups/service/user-groups.service';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

import { UserGroupUsersUpdateComponent } from './user-group-users-update.component';

describe('UserGroupUsers Management Update Component', () => {
  let comp: UserGroupUsersUpdateComponent;
  let fixture: ComponentFixture<UserGroupUsersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userGroupUsersFormService: UserGroupUsersFormService;
  let userGroupUsersService: UserGroupUsersService;
  let userGroupsService: UserGroupsService;
  let appUsersService: AppUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserGroupUsersUpdateComponent],
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
      .overrideTemplate(UserGroupUsersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserGroupUsersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userGroupUsersFormService = TestBed.inject(UserGroupUsersFormService);
    userGroupUsersService = TestBed.inject(UserGroupUsersService);
    userGroupsService = TestBed.inject(UserGroupsService);
    appUsersService = TestBed.inject(AppUsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserGroups query and add missing value', () => {
      const userGroupUsers: IUserGroupUsers = { id: 456 };
      const group: IUserGroups = { id: 18584 };
      userGroupUsers.group = group;

      const userGroupsCollection: IUserGroups[] = [{ id: 24606 }];
      jest.spyOn(userGroupsService, 'query').mockReturnValue(of(new HttpResponse({ body: userGroupsCollection })));
      const additionalUserGroups = [group];
      const expectedCollection: IUserGroups[] = [...additionalUserGroups, ...userGroupsCollection];
      jest.spyOn(userGroupsService, 'addUserGroupsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupUsers });
      comp.ngOnInit();

      expect(userGroupsService.query).toHaveBeenCalled();
      expect(userGroupsService.addUserGroupsToCollectionIfMissing).toHaveBeenCalledWith(
        userGroupsCollection,
        ...additionalUserGroups.map(expect.objectContaining)
      );
      expect(comp.userGroupsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AppUsers query and add missing value', () => {
      const userGroupUsers: IUserGroupUsers = { id: 456 };
      const user: IAppUsers = { id: 65743 };
      userGroupUsers.user = user;

      const appUsersCollection: IAppUsers[] = [{ id: 59661 }];
      jest.spyOn(appUsersService, 'query').mockReturnValue(of(new HttpResponse({ body: appUsersCollection })));
      const additionalAppUsers = [user];
      const expectedCollection: IAppUsers[] = [...additionalAppUsers, ...appUsersCollection];
      jest.spyOn(appUsersService, 'addAppUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupUsers });
      comp.ngOnInit();

      expect(appUsersService.query).toHaveBeenCalled();
      expect(appUsersService.addAppUsersToCollectionIfMissing).toHaveBeenCalledWith(
        appUsersCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userGroupUsers: IUserGroupUsers = { id: 456 };
      const group: IUserGroups = { id: 38417 };
      userGroupUsers.group = group;
      const user: IAppUsers = { id: 28514 };
      userGroupUsers.user = user;

      activatedRoute.data = of({ userGroupUsers });
      comp.ngOnInit();

      expect(comp.userGroupsSharedCollection).toContain(group);
      expect(comp.appUsersSharedCollection).toContain(user);
      expect(comp.userGroupUsers).toEqual(userGroupUsers);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupUsers>>();
      const userGroupUsers = { id: 123 };
      jest.spyOn(userGroupUsersFormService, 'getUserGroupUsers').mockReturnValue(userGroupUsers);
      jest.spyOn(userGroupUsersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupUsers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroupUsers }));
      saveSubject.complete();

      // THEN
      expect(userGroupUsersFormService.getUserGroupUsers).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userGroupUsersService.update).toHaveBeenCalledWith(expect.objectContaining(userGroupUsers));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupUsers>>();
      const userGroupUsers = { id: 123 };
      jest.spyOn(userGroupUsersFormService, 'getUserGroupUsers').mockReturnValue({ id: null });
      jest.spyOn(userGroupUsersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupUsers: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroupUsers }));
      saveSubject.complete();

      // THEN
      expect(userGroupUsersFormService.getUserGroupUsers).toHaveBeenCalled();
      expect(userGroupUsersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupUsers>>();
      const userGroupUsers = { id: 123 };
      jest.spyOn(userGroupUsersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupUsers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userGroupUsersService.update).toHaveBeenCalled();
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
