import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFinalGroup, NewFinalGroup } from '../final-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFinalGroup for edit and NewFinalGroupFormGroupInput for create.
 */
type FinalGroupFormGroupInput = IFinalGroup | PartialWithRequiredKeyOf<NewFinalGroup>;

type FinalGroupFormDefaults = Pick<NewFinalGroup, 'id' | 'isAdvertised'>;

type FinalGroupFormGroupContent = {
  id: FormControl<IFinalGroup['id'] | NewFinalGroup['id']>;
  name: FormControl<IFinalGroup['name']>;
  members: FormControl<IFinalGroup['members']>;
  isAdvertised: FormControl<IFinalGroup['isAdvertised']>;
  groupDescription: FormControl<IFinalGroup['groupDescription']>;
  pfp: FormControl<IFinalGroup['pfp']>;
  admins: FormControl<IFinalGroup['admins']>;
};

export type FinalGroupFormGroup = FormGroup<FinalGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FinalGroupFormService {
  createFinalGroupFormGroup(finalGroup: FinalGroupFormGroupInput = { id: null }): FinalGroupFormGroup {
    const finalGroupRawValue = {
      ...this.getFormDefaults(),
      ...finalGroup,
    };
    return new FormGroup<FinalGroupFormGroupContent>({
      id: new FormControl(
        { value: finalGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(finalGroupRawValue.name),
      members: new FormControl(finalGroupRawValue.members, {
        validators: [Validators.maxLength(30000)],
      }),
      isAdvertised: new FormControl(finalGroupRawValue.isAdvertised),
      groupDescription: new FormControl(finalGroupRawValue.groupDescription, {
        validators: [Validators.maxLength(10000)],
      }),
      pfp: new FormControl(finalGroupRawValue.pfp, {
        validators: [Validators.maxLength(10485760)],
      }),
      admins: new FormControl(finalGroupRawValue.admins, {
        validators: [Validators.maxLength(30000)],
      }),
    });
  }

  getFinalGroup(form: FinalGroupFormGroup): IFinalGroup | NewFinalGroup {
    return form.getRawValue() as IFinalGroup | NewFinalGroup;
  }

  resetForm(form: FinalGroupFormGroup, finalGroup: FinalGroupFormGroupInput): void {
    const finalGroupRawValue = { ...this.getFormDefaults(), ...finalGroup };
    form.reset(
      {
        ...finalGroupRawValue,
        id: { value: finalGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FinalGroupFormDefaults {
    return {
      id: null,
      isAdvertised: false,
    };
  }
}
