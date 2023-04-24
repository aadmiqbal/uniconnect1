import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFinalUser, NewFinalUser } from '../final-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFinalUser for edit and NewFinalUserFormGroupInput for create.
 */
type FinalUserFormGroupInput = IFinalUser | PartialWithRequiredKeyOf<NewFinalUser>;

type FinalUserFormDefaults = Pick<NewFinalUser, 'id'>;

type FinalUserFormGroupContent = {
  id: FormControl<IFinalUser['id'] | NewFinalUser['id']>;
  name: FormControl<IFinalUser['name']>;
  studyYear: FormControl<IFinalUser['studyYear']>;
  bio: FormControl<IFinalUser['bio']>;
  pfp: FormControl<IFinalUser['pfp']>;
  modules: FormControl<IFinalUser['modules']>;
  firstName: FormControl<IFinalUser['firstName']>;
  lastName: FormControl<IFinalUser['lastName']>;
  user: FormControl<IFinalUser['user']>;
};

export type FinalUserFormGroup = FormGroup<FinalUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FinalUserFormService {
  createFinalUserFormGroup(finalUser: FinalUserFormGroupInput = { id: null }): FinalUserFormGroup {
    const finalUserRawValue = {
      ...this.getFormDefaults(),
      ...finalUser,
    };
    return new FormGroup<FinalUserFormGroupContent>({
      id: new FormControl(
        { value: finalUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(finalUserRawValue.name),
      studyYear: new FormControl(finalUserRawValue.studyYear),
      bio: new FormControl(finalUserRawValue.bio, {
        validators: [Validators.maxLength(2000)],
      }),
      pfp: new FormControl(finalUserRawValue.pfp, {
        validators: [Validators.maxLength(10485760)],
      }),
      modules: new FormControl(finalUserRawValue.modules, {
        validators: [Validators.maxLength(2000)],
      }),
      firstName: new FormControl(finalUserRawValue.firstName),
      lastName: new FormControl(finalUserRawValue.lastName),
      user: new FormControl(finalUserRawValue.user),
    });
  }

  getFinalUser(form: FinalUserFormGroup): IFinalUser | NewFinalUser {
    return form.getRawValue() as IFinalUser | NewFinalUser;
  }

  resetForm(form: FinalUserFormGroup, finalUser: FinalUserFormGroupInput): void {
    const finalUserRawValue = { ...this.getFormDefaults(), ...finalUser };
    form.reset(
      {
        ...finalUserRawValue,
        id: { value: finalUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FinalUserFormDefaults {
    return {
      id: null,
    };
  }
}
