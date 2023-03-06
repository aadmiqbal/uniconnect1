import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserGroupsFormService } from './user-groups-form.service';
import { UserGroupsService } from '../service/user-groups.service';
import { IUserGroups } from '../user-groups.model';

import { UserGroupsUpdateComponent } from './user-groups-update.component';

describe('UserGroups Management Update Component', () => {
  let comp: UserGroupsUpdateComponent;
  let fixture: ComponentFixture<UserGroupsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userGroupsFormService: UserGroupsFormService;
  let userGroupsService: UserGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserGroupsUpdateComponent],
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
      .overrideTemplate(UserGroupsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserGroupsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userGroupsFormService = TestBed.inject(UserGroupsFormService);
    userGroupsService = TestBed.inject(UserGroupsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userGroups: IUserGroups = { id: 456 };

      activatedRoute.data = of({ userGroups });
      comp.ngOnInit();

      expect(comp.userGroups).toEqual(userGroups);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroups>>();
      const userGroups = { id: 123 };
      jest.spyOn(userGroupsFormService, 'getUserGroups').mockReturnValue(userGroups);
      jest.spyOn(userGroupsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroups });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroups }));
      saveSubject.complete();

      // THEN
      expect(userGroupsFormService.getUserGroups).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userGroupsService.update).toHaveBeenCalledWith(expect.objectContaining(userGroups));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroups>>();
      const userGroups = { id: 123 };
      jest.spyOn(userGroupsFormService, 'getUserGroups').mockReturnValue({ id: null });
      jest.spyOn(userGroupsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroups: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroups }));
      saveSubject.complete();

      // THEN
      expect(userGroupsFormService.getUserGroups).toHaveBeenCalled();
      expect(userGroupsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroups>>();
      const userGroups = { id: 123 };
      jest.spyOn(userGroupsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroups });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userGroupsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
