import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../degrees.test-samples';

import { DegreesFormService } from './degrees-form.service';

describe('Degrees Form Service', () => {
  let service: DegreesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DegreesFormService);
  });

  describe('Service methods', () => {
    describe('createDegreesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDegreesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            degreeName: expect.any(Object),
          })
        );
      });

      it('passing IDegrees should create a new form with FormGroup', () => {
        const formGroup = service.createDegreesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            degreeName: expect.any(Object),
          })
        );
      });
    });

    describe('getDegrees', () => {
      it('should return NewDegrees for default Degrees initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDegreesFormGroup(sampleWithNewData);

        const degrees = service.getDegrees(formGroup) as any;

        expect(degrees).toMatchObject(sampleWithNewData);
      });

      it('should return NewDegrees for empty Degrees initial value', () => {
        const formGroup = service.createDegreesFormGroup();

        const degrees = service.getDegrees(formGroup) as any;

        expect(degrees).toMatchObject({});
      });

      it('should return IDegrees', () => {
        const formGroup = service.createDegreesFormGroup(sampleWithRequiredData);

        const degrees = service.getDegrees(formGroup) as any;

        expect(degrees).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDegrees should not enable id FormControl', () => {
        const formGroup = service.createDegreesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDegrees should disable id FormControl', () => {
        const formGroup = service.createDegreesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
