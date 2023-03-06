import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-modules.test-samples';

import { UserModulesFormService } from './user-modules-form.service';

describe('UserModules Form Service', () => {
  let service: UserModulesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserModulesFormService);
  });

  describe('Service methods', () => {
    describe('createUserModulesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserModulesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            moduleName: expect.any(Object),
            optional: expect.any(Object),
            studyYear: expect.any(Object),
          })
        );
      });

      it('passing IUserModules should create a new form with FormGroup', () => {
        const formGroup = service.createUserModulesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            moduleName: expect.any(Object),
            optional: expect.any(Object),
            studyYear: expect.any(Object),
          })
        );
      });
    });

    describe('getUserModules', () => {
      it('should return NewUserModules for default UserModules initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserModulesFormGroup(sampleWithNewData);

        const userModules = service.getUserModules(formGroup) as any;

        expect(userModules).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserModules for empty UserModules initial value', () => {
        const formGroup = service.createUserModulesFormGroup();

        const userModules = service.getUserModules(formGroup) as any;

        expect(userModules).toMatchObject({});
      });

      it('should return IUserModules', () => {
        const formGroup = service.createUserModulesFormGroup(sampleWithRequiredData);

        const userModules = service.getUserModules(formGroup) as any;

        expect(userModules).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserModules should not enable id FormControl', () => {
        const formGroup = service.createUserModulesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserModules should disable id FormControl', () => {
        const formGroup = service.createUserModulesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
