import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-extra.test-samples';

import { UserExtraFormService } from './user-extra-form.service';

describe('UserExtra Form Service', () => {
  let service: UserExtraFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExtraFormService);
  });

  describe('Service methods', () => {
    describe('createUserExtraFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserExtraFormGroup();

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

      it('passing IUserExtra should create a new form with FormGroup', () => {
        const formGroup = service.createUserExtraFormGroup(sampleWithRequiredData);

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

    describe('getUserExtra', () => {
      it('should return NewUserExtra for default UserExtra initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserExtraFormGroup(sampleWithNewData);

        const userExtra = service.getUserExtra(formGroup) as any;

        expect(userExtra).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserExtra for empty UserExtra initial value', () => {
        const formGroup = service.createUserExtraFormGroup();

        const userExtra = service.getUserExtra(formGroup) as any;

        expect(userExtra).toMatchObject({});
      });

      it('should return IUserExtra', () => {
        const formGroup = service.createUserExtraFormGroup(sampleWithRequiredData);

        const userExtra = service.getUserExtra(formGroup) as any;

        expect(userExtra).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserExtra should not enable id FormControl', () => {
        const formGroup = service.createUserExtraFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserExtra should disable id FormControl', () => {
        const formGroup = service.createUserExtraFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
