import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-group-ad.test-samples';

import { UserGroupAdFormService } from './user-group-ad-form.service';

describe('UserGroupAd Form Service', () => {
  let service: UserGroupAdFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGroupAdFormService);
  });

  describe('Service methods', () => {
    describe('createUserGroupAdFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserGroupAdFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            groupBio: expect.any(Object),
            group: expect.any(Object),
          })
        );
      });

      it('passing IUserGroupAd should create a new form with FormGroup', () => {
        const formGroup = service.createUserGroupAdFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            groupBio: expect.any(Object),
            group: expect.any(Object),
          })
        );
      });
    });

    describe('getUserGroupAd', () => {
      it('should return NewUserGroupAd for default UserGroupAd initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserGroupAdFormGroup(sampleWithNewData);

        const userGroupAd = service.getUserGroupAd(formGroup) as any;

        expect(userGroupAd).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserGroupAd for empty UserGroupAd initial value', () => {
        const formGroup = service.createUserGroupAdFormGroup();

        const userGroupAd = service.getUserGroupAd(formGroup) as any;

        expect(userGroupAd).toMatchObject({});
      });

      it('should return IUserGroupAd', () => {
        const formGroup = service.createUserGroupAdFormGroup(sampleWithRequiredData);

        const userGroupAd = service.getUserGroupAd(formGroup) as any;

        expect(userGroupAd).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserGroupAd should not enable id FormControl', () => {
        const formGroup = service.createUserGroupAdFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserGroupAd should disable id FormControl', () => {
        const formGroup = service.createUserGroupAdFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
