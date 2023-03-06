import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IConnections, NewConnections } from '../connections.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConnections for edit and NewConnectionsFormGroupInput for create.
 */
type ConnectionsFormGroupInput = IConnections | PartialWithRequiredKeyOf<NewConnections>;

type ConnectionsFormDefaults = Pick<NewConnections, 'id'>;

type ConnectionsFormGroupContent = {
  id: FormControl<IConnections['id'] | NewConnections['id']>;
  user1: FormControl<IConnections['user1']>;
  user2: FormControl<IConnections['user2']>;
};

export type ConnectionsFormGroup = FormGroup<ConnectionsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConnectionsFormService {
  createConnectionsFormGroup(connections: ConnectionsFormGroupInput = { id: null }): ConnectionsFormGroup {
    const connectionsRawValue = {
      ...this.getFormDefaults(),
      ...connections,
    };
    return new FormGroup<ConnectionsFormGroupContent>({
      id: new FormControl(
        { value: connectionsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user1: new FormControl(connectionsRawValue.user1),
      user2: new FormControl(connectionsRawValue.user2),
    });
  }

  getConnections(form: ConnectionsFormGroup): IConnections | NewConnections {
    return form.getRawValue() as IConnections | NewConnections;
  }

  resetForm(form: ConnectionsFormGroup, connections: ConnectionsFormGroupInput): void {
    const connectionsRawValue = { ...this.getFormDefaults(), ...connections };
    form.reset(
      {
        ...connectionsRawValue,
        id: { value: connectionsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ConnectionsFormDefaults {
    return {
      id: null,
    };
  }
}
