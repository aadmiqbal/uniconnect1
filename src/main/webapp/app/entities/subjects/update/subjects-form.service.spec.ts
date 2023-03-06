import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../subjects.test-samples';

import { SubjectsFormService } from './subjects-form.service';

describe('Subjects Form Service', () => {
  let service: SubjectsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectsFormService);
  });

  describe('Service methods', () => {
    describe('createSubjectsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSubjectsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subjectName: expect.any(Object),
          })
        );
      });

      it('passing ISubjects should create a new form with FormGroup', () => {
        const formGroup = service.createSubjectsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subjectName: expect.any(Object),
          })
        );
      });
    });

    describe('getSubjects', () => {
      it('should return NewSubjects for default Subjects initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSubjectsFormGroup(sampleWithNewData);

        const subjects = service.getSubjects(formGroup) as any;

        expect(subjects).toMatchObject(sampleWithNewData);
      });

      it('should return NewSubjects for empty Subjects initial value', () => {
        const formGroup = service.createSubjectsFormGroup();

        const subjects = service.getSubjects(formGroup) as any;

        expect(subjects).toMatchObject({});
      });

      it('should return ISubjects', () => {
        const formGroup = service.createSubjectsFormGroup(sampleWithRequiredData);

        const subjects = service.getSubjects(formGroup) as any;

        expect(subjects).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISubjects should not enable id FormControl', () => {
        const formGroup = service.createSubjectsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSubjects should disable id FormControl', () => {
        const formGroup = service.createSubjectsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
