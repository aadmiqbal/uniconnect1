import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DegreeSubjectsFormService } from './degree-subjects-form.service';
import { DegreeSubjectsService } from '../service/degree-subjects.service';
import { IDegreeSubjects } from '../degree-subjects.model';
import { IDegrees } from 'app/entities/degrees/degrees.model';
import { DegreesService } from 'app/entities/degrees/service/degrees.service';
import { ISubjects } from 'app/entities/subjects/subjects.model';
import { SubjectsService } from 'app/entities/subjects/service/subjects.service';

import { DegreeSubjectsUpdateComponent } from './degree-subjects-update.component';

describe('DegreeSubjects Management Update Component', () => {
  let comp: DegreeSubjectsUpdateComponent;
  let fixture: ComponentFixture<DegreeSubjectsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let degreeSubjectsFormService: DegreeSubjectsFormService;
  let degreeSubjectsService: DegreeSubjectsService;
  let degreesService: DegreesService;
  let subjectsService: SubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DegreeSubjectsUpdateComponent],
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
      .overrideTemplate(DegreeSubjectsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DegreeSubjectsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    degreeSubjectsFormService = TestBed.inject(DegreeSubjectsFormService);
    degreeSubjectsService = TestBed.inject(DegreeSubjectsService);
    degreesService = TestBed.inject(DegreesService);
    subjectsService = TestBed.inject(SubjectsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Degrees query and add missing value', () => {
      const degreeSubjects: IDegreeSubjects = { id: 456 };
      const degree: IDegrees = { id: 33454 };
      degreeSubjects.degree = degree;

      const degreesCollection: IDegrees[] = [{ id: 36388 }];
      jest.spyOn(degreesService, 'query').mockReturnValue(of(new HttpResponse({ body: degreesCollection })));
      const additionalDegrees = [degree];
      const expectedCollection: IDegrees[] = [...additionalDegrees, ...degreesCollection];
      jest.spyOn(degreesService, 'addDegreesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ degreeSubjects });
      comp.ngOnInit();

      expect(degreesService.query).toHaveBeenCalled();
      expect(degreesService.addDegreesToCollectionIfMissing).toHaveBeenCalledWith(
        degreesCollection,
        ...additionalDegrees.map(expect.objectContaining)
      );
      expect(comp.degreesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Subjects query and add missing value', () => {
      const degreeSubjects: IDegreeSubjects = { id: 456 };
      const subject: ISubjects = { id: 22079 };
      degreeSubjects.subject = subject;

      const subjectsCollection: ISubjects[] = [{ id: 76857 }];
      jest.spyOn(subjectsService, 'query').mockReturnValue(of(new HttpResponse({ body: subjectsCollection })));
      const additionalSubjects = [subject];
      const expectedCollection: ISubjects[] = [...additionalSubjects, ...subjectsCollection];
      jest.spyOn(subjectsService, 'addSubjectsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ degreeSubjects });
      comp.ngOnInit();

      expect(subjectsService.query).toHaveBeenCalled();
      expect(subjectsService.addSubjectsToCollectionIfMissing).toHaveBeenCalledWith(
        subjectsCollection,
        ...additionalSubjects.map(expect.objectContaining)
      );
      expect(comp.subjectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const degreeSubjects: IDegreeSubjects = { id: 456 };
      const degree: IDegrees = { id: 60183 };
      degreeSubjects.degree = degree;
      const subject: ISubjects = { id: 22119 };
      degreeSubjects.subject = subject;

      activatedRoute.data = of({ degreeSubjects });
      comp.ngOnInit();

      expect(comp.degreesSharedCollection).toContain(degree);
      expect(comp.subjectsSharedCollection).toContain(subject);
      expect(comp.degreeSubjects).toEqual(degreeSubjects);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDegreeSubjects>>();
      const degreeSubjects = { id: 123 };
      jest.spyOn(degreeSubjectsFormService, 'getDegreeSubjects').mockReturnValue(degreeSubjects);
      jest.spyOn(degreeSubjectsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ degreeSubjects });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: degreeSubjects }));
      saveSubject.complete();

      // THEN
      expect(degreeSubjectsFormService.getDegreeSubjects).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(degreeSubjectsService.update).toHaveBeenCalledWith(expect.objectContaining(degreeSubjects));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDegreeSubjects>>();
      const degreeSubjects = { id: 123 };
      jest.spyOn(degreeSubjectsFormService, 'getDegreeSubjects').mockReturnValue({ id: null });
      jest.spyOn(degreeSubjectsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ degreeSubjects: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: degreeSubjects }));
      saveSubject.complete();

      // THEN
      expect(degreeSubjectsFormService.getDegreeSubjects).toHaveBeenCalled();
      expect(degreeSubjectsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDegreeSubjects>>();
      const degreeSubjects = { id: 123 };
      jest.spyOn(degreeSubjectsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ degreeSubjects });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(degreeSubjectsService.update).toHaveBeenCalled();
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

    describe('compareSubjects', () => {
      it('Should forward to subjectsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(subjectsService, 'compareSubjects');
        comp.compareSubjects(entity, entity2);
        expect(subjectsService.compareSubjects).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
