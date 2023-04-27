import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FinalGroupFormService } from './final-group-form.service';
import { FinalGroupService } from '../service/final-group.service';
import { IFinalGroup } from '../final-group.model';

import { FinalGroupUpdateComponent } from './final-group-update.component';

describe('FinalGroup Management Update Component', () => {
  let comp: FinalGroupUpdateComponent;
  let fixture: ComponentFixture<FinalGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let finalGroupFormService: FinalGroupFormService;
  let finalGroupService: FinalGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FinalGroupUpdateComponent],
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
      .overrideTemplate(FinalGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinalGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    finalGroupFormService = TestBed.inject(FinalGroupFormService);
    finalGroupService = TestBed.inject(FinalGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const finalGroup: IFinalGroup = { id: 456 };

      activatedRoute.data = of({ finalGroup });
      comp.ngOnInit();

      expect(comp.finalGroup).toEqual(finalGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinalGroup>>();
      const finalGroup = { id: 123 };
      jest.spyOn(finalGroupFormService, 'getFinalGroup').mockReturnValue(finalGroup);
      jest.spyOn(finalGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: finalGroup }));
      saveSubject.complete();

      // THEN
      expect(finalGroupFormService.getFinalGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(finalGroupService.update).toHaveBeenCalledWith(expect.objectContaining(finalGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinalGroup>>();
      const finalGroup = { id: 123 };
      jest.spyOn(finalGroupFormService, 'getFinalGroup').mockReturnValue({ id: null });
      jest.spyOn(finalGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: finalGroup }));
      saveSubject.complete();

      // THEN
      expect(finalGroupFormService.getFinalGroup).toHaveBeenCalled();
      expect(finalGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFinalGroup>>();
      const finalGroup = { id: 123 };
      jest.spyOn(finalGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finalGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(finalGroupService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
