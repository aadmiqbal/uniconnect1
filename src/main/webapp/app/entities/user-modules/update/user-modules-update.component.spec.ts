import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserModulesFormService } from './user-modules-form.service';
import { UserModulesService } from '../service/user-modules.service';
import { IUserModules } from '../user-modules.model';

import { UserModulesUpdateComponent } from './user-modules-update.component';

describe('UserModules Management Update Component', () => {
  let comp: UserModulesUpdateComponent;
  let fixture: ComponentFixture<UserModulesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userModulesFormService: UserModulesFormService;
  let userModulesService: UserModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserModulesUpdateComponent],
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
      .overrideTemplate(UserModulesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserModulesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userModulesFormService = TestBed.inject(UserModulesFormService);
    userModulesService = TestBed.inject(UserModulesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userModules: IUserModules = { id: 456 };

      activatedRoute.data = of({ userModules });
      comp.ngOnInit();

      expect(comp.userModules).toEqual(userModules);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserModules>>();
      const userModules = { id: 123 };
      jest.spyOn(userModulesFormService, 'getUserModules').mockReturnValue(userModules);
      jest.spyOn(userModulesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userModules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userModules }));
      saveSubject.complete();

      // THEN
      expect(userModulesFormService.getUserModules).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userModulesService.update).toHaveBeenCalledWith(expect.objectContaining(userModules));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserModules>>();
      const userModules = { id: 123 };
      jest.spyOn(userModulesFormService, 'getUserModules').mockReturnValue({ id: null });
      jest.spyOn(userModulesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userModules: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userModules }));
      saveSubject.complete();

      // THEN
      expect(userModulesFormService.getUserModules).toHaveBeenCalled();
      expect(userModulesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserModules>>();
      const userModules = { id: 123 };
      jest.spyOn(userModulesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userModules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userModulesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
