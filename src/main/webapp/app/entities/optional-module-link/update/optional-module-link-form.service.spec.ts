import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../optional-module-link.test-samples';

import { OptionalModuleLinkFormService } from './optional-module-link-form.service';

describe('OptionalModuleLink Form Service', () => {
  let service: OptionalModuleLinkFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionalModuleLinkFormService);
  });

  describe('Service methods', () => {
    describe('createOptionalModuleLinkFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOptionalModuleLinkFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            optionalModule: expect.any(Object),
            optionalModuleUser: expect.any(Object),
          })
        );
      });

      it('passing IOptionalModuleLink should create a new form with FormGroup', () => {
        const formGroup = service.createOptionalModuleLinkFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            optionalModule: expect.any(Object),
            optionalModuleUser: expect.any(Object),
          })
        );
      });
    });

    describe('getOptionalModuleLink', () => {
      it('should return NewOptionalModuleLink for default OptionalModuleLink initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOptionalModuleLinkFormGroup(sampleWithNewData);

        const optionalModuleLink = service.getOptionalModuleLink(formGroup) as any;

        expect(optionalModuleLink).toMatchObject(sampleWithNewData);
      });

      it('should return NewOptionalModuleLink for empty OptionalModuleLink initial value', () => {
        const formGroup = service.createOptionalModuleLinkFormGroup();

        const optionalModuleLink = service.getOptionalModuleLink(formGroup) as any;

        expect(optionalModuleLink).toMatchObject({});
      });

      it('should return IOptionalModuleLink', () => {
        const formGroup = service.createOptionalModuleLinkFormGroup(sampleWithRequiredData);

        const optionalModuleLink = service.getOptionalModuleLink(formGroup) as any;

        expect(optionalModuleLink).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOptionalModuleLink should not enable id FormControl', () => {
        const formGroup = service.createOptionalModuleLinkFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOptionalModuleLink should disable id FormControl', () => {
        const formGroup = service.createOptionalModuleLinkFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
