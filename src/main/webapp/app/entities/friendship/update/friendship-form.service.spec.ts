import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../friendship.test-samples';

import { FriendshipFormService } from './friendship-form.service';

describe('Friendship Form Service', () => {
  let service: FriendshipFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendshipFormService);
  });

  describe('Service methods', () => {
    describe('createFriendshipFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFriendshipFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            finalUser: expect.any(Object),
            finalUser2: expect.any(Object),
          })
        );
      });

      it('passing IFriendship should create a new form with FormGroup', () => {
        const formGroup = service.createFriendshipFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            finalUser: expect.any(Object),
            finalUser2: expect.any(Object),
          })
        );
      });
    });

    describe('getFriendship', () => {
      it('should return NewFriendship for default Friendship initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFriendshipFormGroup(sampleWithNewData);

        const friendship = service.getFriendship(formGroup) as any;

        expect(friendship).toMatchObject(sampleWithNewData);
      });

      it('should return NewFriendship for empty Friendship initial value', () => {
        const formGroup = service.createFriendshipFormGroup();

        const friendship = service.getFriendship(formGroup) as any;

        expect(friendship).toMatchObject({});
      });

      it('should return IFriendship', () => {
        const formGroup = service.createFriendshipFormGroup(sampleWithRequiredData);

        const friendship = service.getFriendship(formGroup) as any;

        expect(friendship).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFriendship should not enable id FormControl', () => {
        const formGroup = service.createFriendshipFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFriendship should disable id FormControl', () => {
        const formGroup = service.createFriendshipFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
