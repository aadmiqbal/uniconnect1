import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-group-users.test-samples';

import { UserGroupUsersFormService } from './user-group-users-form.service';

describe('UserGroupUsers Form Service', () => {
  let service: UserGroupUsersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGroupUsersFormService);
  });

  describe('Service methods', () => {
    describe('createUserGroupUsersFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserGroupUsersFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            group: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IUserGroupUsers should create a new form with FormGroup', () => {
        const formGroup = service.createUserGroupUsersFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            group: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getUserGroupUsers', () => {
      it('should return NewUserGroupUsers for default UserGroupUsers initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserGroupUsersFormGroup(sampleWithNewData);

        const userGroupUsers = service.getUserGroupUsers(formGroup) as any;

        expect(userGroupUsers).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserGroupUsers for empty UserGroupUsers initial value', () => {
        const formGroup = service.createUserGroupUsersFormGroup();

        const userGroupUsers = service.getUserGroupUsers(formGroup) as any;

        expect(userGroupUsers).toMatchObject({});
      });

      it('should return IUserGroupUsers', () => {
        const formGroup = service.createUserGroupUsersFormGroup(sampleWithRequiredData);

        const userGroupUsers = service.getUserGroupUsers(formGroup) as any;

        expect(userGroupUsers).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserGroupUsers should not enable id FormControl', () => {
        const formGroup = service.createUserGroupUsersFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserGroupUsers should disable id FormControl', () => {
        const formGroup = service.createUserGroupUsersFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
