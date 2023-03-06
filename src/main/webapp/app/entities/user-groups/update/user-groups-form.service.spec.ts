import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-groups.test-samples';

import { UserGroupsFormService } from './user-groups-form.service';

describe('UserGroups Form Service', () => {
  let service: UserGroupsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGroupsFormService);
  });

  describe('Service methods', () => {
    describe('createUserGroupsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserGroupsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            groupName: expect.any(Object),
          })
        );
      });

      it('passing IUserGroups should create a new form with FormGroup', () => {
        const formGroup = service.createUserGroupsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            groupName: expect.any(Object),
          })
        );
      });
    });

    describe('getUserGroups', () => {
      it('should return NewUserGroups for default UserGroups initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserGroupsFormGroup(sampleWithNewData);

        const userGroups = service.getUserGroups(formGroup) as any;

        expect(userGroups).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserGroups for empty UserGroups initial value', () => {
        const formGroup = service.createUserGroupsFormGroup();

        const userGroups = service.getUserGroups(formGroup) as any;

        expect(userGroups).toMatchObject({});
      });

      it('should return IUserGroups', () => {
        const formGroup = service.createUserGroupsFormGroup(sampleWithRequiredData);

        const userGroups = service.getUserGroups(formGroup) as any;

        expect(userGroups).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserGroups should not enable id FormControl', () => {
        const formGroup = service.createUserGroupsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserGroups should disable id FormControl', () => {
        const formGroup = service.createUserGroupsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
