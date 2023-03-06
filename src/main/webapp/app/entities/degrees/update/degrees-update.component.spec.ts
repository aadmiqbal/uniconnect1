import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DegreesFormService } from './degrees-form.service';
import { DegreesService } from '../service/degrees.service';
import { IDegrees } from '../degrees.model';

import { DegreesUpdateComponent } from './degrees-update.component';

describe('Degrees Management Update Component', () => {
  let comp: DegreesUpdateComponent;
  let fixture: ComponentFixture<DegreesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let degreesFormService: DegreesFormService;
  let degreesService: DegreesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DegreesUpdateComponent],
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
      .overrideTemplate(DegreesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DegreesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    degreesFormService = TestBed.inject(DegreesFormService);
    degreesService = TestBed.inject(DegreesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const degrees: IDegrees = { id: 456 };

      activatedRoute.data = of({ degrees });
      comp.ngOnInit();

      expect(comp.degrees).toEqual(degrees);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDegrees>>();
      const degrees = { id: 123 };
      jest.spyOn(degreesFormService, 'getDegrees').mockReturnValue(degrees);
      jest.spyOn(degreesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ degrees });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: degrees }));
      saveSubject.complete();

      // THEN
      expect(degreesFormService.getDegrees).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(degreesService.update).toHaveBeenCalledWith(expect.objectContaining(degrees));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDegrees>>();
      const degrees = { id: 123 };
      jest.spyOn(degreesFormService, 'getDegrees').mockReturnValue({ id: null });
      jest.spyOn(degreesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ degrees: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: degrees }));
      saveSubject.complete();

      // THEN
      expect(degreesFormService.getDegrees).toHaveBeenCalled();
      expect(degreesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDegrees>>();
      const degrees = { id: 123 };
      jest.spyOn(degreesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ degrees });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(degreesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
