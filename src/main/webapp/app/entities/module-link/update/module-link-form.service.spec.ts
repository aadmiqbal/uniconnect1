import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../module-link.test-samples';

import { ModuleLinkFormService } from './module-link-form.service';

describe('ModuleLink Form Service', () => {
  let service: ModuleLinkFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleLinkFormService);
  });

  describe('Service methods', () => {
    describe('createModuleLinkFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createModuleLinkFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            optionalModule: expect.any(Object),
            optionalModuleUser: expect.any(Object),
          })
        );
      });

      it('passing IModuleLink should create a new form with FormGroup', () => {
        const formGroup = service.createModuleLinkFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            optionalModule: expect.any(Object),
            optionalModuleUser: expect.any(Object),
          })
        );
      });
    });

    describe('getModuleLink', () => {
      it('should return NewModuleLink for default ModuleLink initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createModuleLinkFormGroup(sampleWithNewData);

        const moduleLink = service.getModuleLink(formGroup) as any;

        expect(moduleLink).toMatchObject(sampleWithNewData);
      });

      it('should return NewModuleLink for empty ModuleLink initial value', () => {
        const formGroup = service.createModuleLinkFormGroup();

        const moduleLink = service.getModuleLink(formGroup) as any;

        expect(moduleLink).toMatchObject({});
      });

      it('should return IModuleLink', () => {
        const formGroup = service.createModuleLinkFormGroup(sampleWithRequiredData);

        const moduleLink = service.getModuleLink(formGroup) as any;

        expect(moduleLink).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IModuleLink should not enable id FormControl', () => {
        const formGroup = service.createModuleLinkFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewModuleLink should disable id FormControl', () => {
        const formGroup = service.createModuleLinkFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
