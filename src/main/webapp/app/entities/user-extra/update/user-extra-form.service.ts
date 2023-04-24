import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserExtra, NewUserExtra } from '../user-extra.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserExtra for edit and NewUserExtraFormGroupInput for create.
 */
type UserExtraFormGroupInput = IUserExtra | PartialWithRequiredKeyOf<NewUserExtra>;

type UserExtraFormDefaults = Pick<NewUserExtra, 'id'>;

type UserExtraFormGroupContent = {
  id: FormControl<IUserExtra['id'] | NewUserExtra['id']>;
  name: FormControl<IUserExtra['name']>;
  studyYear: FormControl<IUserExtra['studyYear']>;
  bio: FormControl<IUserExtra['bio']>;
  pfp: FormControl<IUserExtra['pfp']>;
  modules: FormControl<IUserExtra['modules']>;
  firstName: FormControl<IUserExtra['firstName']>;
  lastName: FormControl<IUserExtra['lastName']>;
  user: FormControl<IUserExtra['user']>;
};

export type UserExtraFormGroup = FormGroup<UserExtraFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserExtraFormService {
  createUserExtraFormGroup(userExtra: UserExtraFormGroupInput = { id: null }): UserExtraFormGroup {
    const userExtraRawValue = {
      ...this.getFormDefaults(),
      ...userExtra,
    };
    return new FormGroup<UserExtraFormGroupContent>({
      id: new FormControl(
        { value: userExtraRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(userExtraRawValue.name),
      studyYear: new FormControl(userExtraRawValue.studyYear),
      bio: new FormControl(userExtraRawValue.bio, {
        validators: [Validators.maxLength(2000)],
      }),
      pfp: new FormControl(userExtraRawValue.pfp, {
        validators: [Validators.maxLength(10485760)],
      }),
      modules: new FormControl(userExtraRawValue.modules, {
        validators: [Validators.maxLength(3000)],
      }),
      firstName: new FormControl(userExtraRawValue.firstName),
      lastName: new FormControl(userExtraRawValue.lastName),
      user: new FormControl(userExtraRawValue.user),
    });
  }

  getUserExtra(form: UserExtraFormGroup): IUserExtra | NewUserExtra {
    return form.getRawValue() as IUserExtra | NewUserExtra;
  }

  resetForm(form: UserExtraFormGroup, userExtra: UserExtraFormGroupInput): void {
    const userExtraRawValue = { ...this.getFormDefaults(), ...userExtra };
    form.reset(
      {
        ...userExtraRawValue,
        id: { value: userExtraRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserExtraFormDefaults {
    return {
      id: null,
    };
  }
}
