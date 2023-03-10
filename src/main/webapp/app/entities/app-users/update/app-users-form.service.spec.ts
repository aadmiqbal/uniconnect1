import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../app-users.test-samples';

import { AppUsersFormService } from './app-users-form.service';

describe('AppUsers Form Service', () => {
  let service: AppUsersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUsersFormService);
  });

  describe('Service methods', () => {
    describe('createAppUsersFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAppUsersFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            studyYear: expect.any(Object),
            bio: expect.any(Object),
            pfp: expect.any(Object),
            degree: expect.any(Object),
          })
        );
      });

      it('passing IAppUsers should create a new form with FormGroup', () => {
        const formGroup = service.createAppUsersFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            studyYear: expect.any(Object),
            bio: expect.any(Object),
            pfp: expect.any(Object),
            degree: expect.any(Object),
          })
        );
      });
    });

    describe('getAppUsers', () => {
      it('should return NewAppUsers for default AppUsers initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAppUsersFormGroup(sampleWithNewData);

        const appUsers = service.getAppUsers(formGroup) as any;

        expect(appUsers).toMatchObject(sampleWithNewData);
      });

      it('should return NewAppUsers for empty AppUsers initial value', () => {
        const formGroup = service.createAppUsersFormGroup();

        const appUsers = service.getAppUsers(formGroup) as any;

        expect(appUsers).toMatchObject({});
      });

      it('should return IAppUsers', () => {
        const formGroup = service.createAppUsersFormGroup(sampleWithRequiredData);

        const appUsers = service.getAppUsers(formGroup) as any;

        expect(appUsers).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAppUsers should not enable id FormControl', () => {
        const formGroup = service.createAppUsersFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAppUsers should disable id FormControl', () => {
        const formGroup = service.createAppUsersFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
