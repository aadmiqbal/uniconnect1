import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../app-user-logins.test-samples';

import { AppUserLoginsFormService } from './app-user-logins-form.service';

describe('AppUserLogins Form Service', () => {
  let service: AppUserLoginsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUserLoginsFormService);
  });

  describe('Service methods', () => {
    describe('createAppUserLoginsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAppUserLoginsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userEmail: expect.any(Object),
            passwordSalt: expect.any(Object),
            passwordHash: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });

      it('passing IAppUserLogins should create a new form with FormGroup', () => {
        const formGroup = service.createAppUserLoginsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userEmail: expect.any(Object),
            passwordSalt: expect.any(Object),
            passwordHash: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });
    });

    describe('getAppUserLogins', () => {
      it('should return NewAppUserLogins for default AppUserLogins initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAppUserLoginsFormGroup(sampleWithNewData);

        const appUserLogins = service.getAppUserLogins(formGroup) as any;

        expect(appUserLogins).toMatchObject(sampleWithNewData);
      });

      it('should return NewAppUserLogins for empty AppUserLogins initial value', () => {
        const formGroup = service.createAppUserLoginsFormGroup();

        const appUserLogins = service.getAppUserLogins(formGroup) as any;

        expect(appUserLogins).toMatchObject({});
      });

      it('should return IAppUserLogins', () => {
        const formGroup = service.createAppUserLoginsFormGroup(sampleWithRequiredData);

        const appUserLogins = service.getAppUserLogins(formGroup) as any;

        expect(appUserLogins).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAppUserLogins should not enable id FormControl', () => {
        const formGroup = service.createAppUserLoginsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAppUserLogins should disable id FormControl', () => {
        const formGroup = service.createAppUserLoginsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
