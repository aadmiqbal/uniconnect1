import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDegrees, NewDegrees } from '../degrees.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDegrees for edit and NewDegreesFormGroupInput for create.
 */
type DegreesFormGroupInput = IDegrees | PartialWithRequiredKeyOf<NewDegrees>;

type DegreesFormDefaults = Pick<NewDegrees, 'id'>;

type DegreesFormGroupContent = {
  id: FormControl<IDegrees['id'] | NewDegrees['id']>;
  degreeName: FormControl<IDegrees['degreeName']>;
};

export type DegreesFormGroup = FormGroup<DegreesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DegreesFormService {
  createDegreesFormGroup(degrees: DegreesFormGroupInput = { id: null }): DegreesFormGroup {
    const degreesRawValue = {
      ...this.getFormDefaults(),
      ...degrees,
    };
    return new FormGroup<DegreesFormGroupContent>({
      id: new FormControl(
        { value: degreesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      degreeName: new FormControl(degreesRawValue.degreeName, {
        validators: [Validators.required],
      }),
    });
  }

  getDegrees(form: DegreesFormGroup): IDegrees | NewDegrees {
    return form.getRawValue() as IDegrees | NewDegrees;
  }

  resetForm(form: DegreesFormGroup, degrees: DegreesFormGroupInput): void {
    const degreesRawValue = { ...this.getFormDefaults(), ...degrees };
    form.reset(
      {
        ...degreesRawValue,
        id: { value: degreesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DegreesFormDefaults {
    return {
      id: null,
    };
  }
}
