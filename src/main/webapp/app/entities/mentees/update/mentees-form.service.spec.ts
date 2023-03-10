import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mentees.test-samples';

import { MenteesFormService } from './mentees-form.service';

describe('Mentees Form Service', () => {
  let service: MenteesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenteesFormService);
  });

  describe('Service methods', () => {
    describe('createMenteesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMenteesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            module: expect.any(Object),
            menteeUser: expect.any(Object),
          })
        );
      });

      it('passing IMentees should create a new form with FormGroup', () => {
        const formGroup = service.createMenteesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            module: expect.any(Object),
            menteeUser: expect.any(Object),
          })
        );
      });
    });

    describe('getMentees', () => {
      it('should return NewMentees for default Mentees initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMenteesFormGroup(sampleWithNewData);

        const mentees = service.getMentees(formGroup) as any;

        expect(mentees).toMatchObject(sampleWithNewData);
      });

      it('should return NewMentees for empty Mentees initial value', () => {
        const formGroup = service.createMenteesFormGroup();

        const mentees = service.getMentees(formGroup) as any;

        expect(mentees).toMatchObject({});
      });

      it('should return IMentees', () => {
        const formGroup = service.createMenteesFormGroup(sampleWithRequiredData);

        const mentees = service.getMentees(formGroup) as any;

        expect(mentees).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMentees should not enable id FormControl', () => {
        const formGroup = service.createMenteesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMentees should disable id FormControl', () => {
        const formGroup = service.createMenteesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
