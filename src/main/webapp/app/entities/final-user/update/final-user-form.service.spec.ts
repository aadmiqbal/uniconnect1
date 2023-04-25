import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../final-user.test-samples';

import { FinalUserFormService } from './final-user-form.service';

describe('FinalUser Form Service', () => {
  let service: FinalUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinalUserFormService);
  });

  describe('Service methods', () => {
    describe('createFinalUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFinalUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            studyYear: expect.any(Object),
            bio: expect.any(Object),
            pfp: expect.any(Object),
            modules: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IFinalUser should create a new form with FormGroup', () => {
        const formGroup = service.createFinalUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            studyYear: expect.any(Object),
            bio: expect.any(Object),
            pfp: expect.any(Object),
            modules: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getFinalUser', () => {
      it('should return NewFinalUser for default FinalUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFinalUserFormGroup(sampleWithNewData);

        const finalUser = service.getFinalUser(formGroup) as any;

        expect(finalUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewFinalUser for empty FinalUser initial value', () => {
        const formGroup = service.createFinalUserFormGroup();

        const finalUser = service.getFinalUser(formGroup) as any;

        expect(finalUser).toMatchObject({});
      });

      it('should return IFinalUser', () => {
        const formGroup = service.createFinalUserFormGroup(sampleWithRequiredData);

        const finalUser = service.getFinalUser(formGroup) as any;

        expect(finalUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFinalUser should not enable id FormControl', () => {
        const formGroup = service.createFinalUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFinalUser should disable id FormControl', () => {
        const formGroup = service.createFinalUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
