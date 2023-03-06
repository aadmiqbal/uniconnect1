import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mentors.test-samples';

import { MentorsFormService } from './mentors-form.service';

describe('Mentors Form Service', () => {
  let service: MentorsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorsFormService);
  });

  describe('Service methods', () => {
    describe('createMentorsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMentorsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            module: expect.any(Object),
            mentorUser: expect.any(Object),
          })
        );
      });

      it('passing IMentors should create a new form with FormGroup', () => {
        const formGroup = service.createMentorsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            module: expect.any(Object),
            mentorUser: expect.any(Object),
          })
        );
      });
    });

    describe('getMentors', () => {
      it('should return NewMentors for default Mentors initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMentorsFormGroup(sampleWithNewData);

        const mentors = service.getMentors(formGroup) as any;

        expect(mentors).toMatchObject(sampleWithNewData);
      });

      it('should return NewMentors for empty Mentors initial value', () => {
        const formGroup = service.createMentorsFormGroup();

        const mentors = service.getMentors(formGroup) as any;

        expect(mentors).toMatchObject({});
      });

      it('should return IMentors', () => {
        const formGroup = service.createMentorsFormGroup(sampleWithRequiredData);

        const mentors = service.getMentors(formGroup) as any;

        expect(mentors).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMentors should not enable id FormControl', () => {
        const formGroup = service.createMentorsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMentors should disable id FormControl', () => {
        const formGroup = service.createMentorsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
