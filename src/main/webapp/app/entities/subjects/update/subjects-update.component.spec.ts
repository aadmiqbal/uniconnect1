import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SubjectsFormService } from './subjects-form.service';
import { SubjectsService } from '../service/subjects.service';
import { ISubjects } from '../subjects.model';

import { SubjectsUpdateComponent } from './subjects-update.component';

describe('Subjects Management Update Component', () => {
  let comp: SubjectsUpdateComponent;
  let fixture: ComponentFixture<SubjectsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let subjectsFormService: SubjectsFormService;
  let subjectsService: SubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SubjectsUpdateComponent],
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
      .overrideTemplate(SubjectsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubjectsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    subjectsFormService = TestBed.inject(SubjectsFormService);
    subjectsService = TestBed.inject(SubjectsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const subjects: ISubjects = { id: 456 };

      activatedRoute.data = of({ subjects });
      comp.ngOnInit();

      expect(comp.subjects).toEqual(subjects);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjects>>();
      const subjects = { id: 123 };
      jest.spyOn(subjectsFormService, 'getSubjects').mockReturnValue(subjects);
      jest.spyOn(subjectsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjects });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subjects }));
      saveSubject.complete();

      // THEN
      expect(subjectsFormService.getSubjects).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(subjectsService.update).toHaveBeenCalledWith(expect.objectContaining(subjects));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjects>>();
      const subjects = { id: 123 };
      jest.spyOn(subjectsFormService, 'getSubjects').mockReturnValue({ id: null });
      jest.spyOn(subjectsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjects: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subjects }));
      saveSubject.complete();

      // THEN
      expect(subjectsFormService.getSubjects).toHaveBeenCalled();
      expect(subjectsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjects>>();
      const subjects = { id: 123 };
      jest.spyOn(subjectsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjects });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(subjectsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
