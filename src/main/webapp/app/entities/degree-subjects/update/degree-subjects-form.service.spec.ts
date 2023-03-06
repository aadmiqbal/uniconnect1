import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../degree-subjects.test-samples';

import { DegreeSubjectsFormService } from './degree-subjects-form.service';

describe('DegreeSubjects Form Service', () => {
  let service: DegreeSubjectsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DegreeSubjectsFormService);
  });

  describe('Service methods', () => {
    describe('createDegreeSubjectsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDegreeSubjectsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            degree: expect.any(Object),
            subject: expect.any(Object),
          })
        );
      });

      it('passing IDegreeSubjects should create a new form with FormGroup', () => {
        const formGroup = service.createDegreeSubjectsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            degree: expect.any(Object),
            subject: expect.any(Object),
          })
        );
      });
    });

    describe('getDegreeSubjects', () => {
      it('should return NewDegreeSubjects for default DegreeSubjects initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDegreeSubjectsFormGroup(sampleWithNewData);

        const degreeSubjects = service.getDegreeSubjects(formGroup) as any;

        expect(degreeSubjects).toMatchObject(sampleWithNewData);
      });

      it('should return NewDegreeSubjects for empty DegreeSubjects initial value', () => {
        const formGroup = service.createDegreeSubjectsFormGroup();

        const degreeSubjects = service.getDegreeSubjects(formGroup) as any;

        expect(degreeSubjects).toMatchObject({});
      });

      it('should return IDegreeSubjects', () => {
        const formGroup = service.createDegreeSubjectsFormGroup(sampleWithRequiredData);

        const degreeSubjects = service.getDegreeSubjects(formGroup) as any;

        expect(degreeSubjects).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDegreeSubjects should not enable id FormControl', () => {
        const formGroup = service.createDegreeSubjectsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDegreeSubjects should disable id FormControl', () => {
        const formGroup = service.createDegreeSubjectsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
