import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mentor-link.test-samples';

import { MentorLinkFormService } from './mentor-link-form.service';

describe('MentorLink Form Service', () => {
  let service: MentorLinkFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorLinkFormService);
  });

  describe('Service methods', () => {
    describe('createMentorLinkFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMentorLinkFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            mentor: expect.any(Object),
            mentee: expect.any(Object),
          })
        );
      });

      it('passing IMentorLink should create a new form with FormGroup', () => {
        const formGroup = service.createMentorLinkFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            mentor: expect.any(Object),
            mentee: expect.any(Object),
          })
        );
      });
    });

    describe('getMentorLink', () => {
      it('should return NewMentorLink for default MentorLink initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMentorLinkFormGroup(sampleWithNewData);

        const mentorLink = service.getMentorLink(formGroup) as any;

        expect(mentorLink).toMatchObject(sampleWithNewData);
      });

      it('should return NewMentorLink for empty MentorLink initial value', () => {
        const formGroup = service.createMentorLinkFormGroup();

        const mentorLink = service.getMentorLink(formGroup) as any;

        expect(mentorLink).toMatchObject({});
      });

      it('should return IMentorLink', () => {
        const formGroup = service.createMentorLinkFormGroup(sampleWithRequiredData);

        const mentorLink = service.getMentorLink(formGroup) as any;

        expect(mentorLink).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMentorLink should not enable id FormControl', () => {
        const formGroup = service.createMentorLinkFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMentorLink should disable id FormControl', () => {
        const formGroup = service.createMentorLinkFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
