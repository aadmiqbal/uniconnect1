import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../final-group.test-samples';

import { FinalGroupFormService } from './final-group-form.service';

describe('FinalGroup Form Service', () => {
  let service: FinalGroupFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinalGroupFormService);
  });

  describe('Service methods', () => {
    describe('createFinalGroupFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFinalGroupFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            members: expect.any(Object),
            isAdvertised: expect.any(Object),
            groupDescription: expect.any(Object),
            pfp: expect.any(Object),
            admins: expect.any(Object),
          })
        );
      });

      it('passing IFinalGroup should create a new form with FormGroup', () => {
        const formGroup = service.createFinalGroupFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            members: expect.any(Object),
            isAdvertised: expect.any(Object),
            groupDescription: expect.any(Object),
            pfp: expect.any(Object),
            admins: expect.any(Object),
          })
        );
      });
    });

    describe('getFinalGroup', () => {
      it('should return NewFinalGroup for default FinalGroup initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFinalGroupFormGroup(sampleWithNewData);

        const finalGroup = service.getFinalGroup(formGroup) as any;

        expect(finalGroup).toMatchObject(sampleWithNewData);
      });

      it('should return NewFinalGroup for empty FinalGroup initial value', () => {
        const formGroup = service.createFinalGroupFormGroup();

        const finalGroup = service.getFinalGroup(formGroup) as any;

        expect(finalGroup).toMatchObject({});
      });

      it('should return IFinalGroup', () => {
        const formGroup = service.createFinalGroupFormGroup(sampleWithRequiredData);

        const finalGroup = service.getFinalGroup(formGroup) as any;

        expect(finalGroup).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFinalGroup should not enable id FormControl', () => {
        const formGroup = service.createFinalGroupFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFinalGroup should disable id FormControl', () => {
        const formGroup = service.createFinalGroupFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
