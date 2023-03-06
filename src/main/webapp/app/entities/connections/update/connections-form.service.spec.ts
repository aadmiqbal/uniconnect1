import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../connections.test-samples';

import { ConnectionsFormService } from './connections-form.service';

describe('Connections Form Service', () => {
  let service: ConnectionsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionsFormService);
  });

  describe('Service methods', () => {
    describe('createConnectionsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConnectionsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user1: expect.any(Object),
            user2: expect.any(Object),
          })
        );
      });

      it('passing IConnections should create a new form with FormGroup', () => {
        const formGroup = service.createConnectionsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user1: expect.any(Object),
            user2: expect.any(Object),
          })
        );
      });
    });

    describe('getConnections', () => {
      it('should return NewConnections for default Connections initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createConnectionsFormGroup(sampleWithNewData);

        const connections = service.getConnections(formGroup) as any;

        expect(connections).toMatchObject(sampleWithNewData);
      });

      it('should return NewConnections for empty Connections initial value', () => {
        const formGroup = service.createConnectionsFormGroup();

        const connections = service.getConnections(formGroup) as any;

        expect(connections).toMatchObject({});
      });

      it('should return IConnections', () => {
        const formGroup = service.createConnectionsFormGroup(sampleWithRequiredData);

        const connections = service.getConnections(formGroup) as any;

        expect(connections).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConnections should not enable id FormControl', () => {
        const formGroup = service.createConnectionsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConnections should disable id FormControl', () => {
        const formGroup = service.createConnectionsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
