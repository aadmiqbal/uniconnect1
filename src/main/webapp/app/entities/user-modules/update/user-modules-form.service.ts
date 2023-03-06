import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserModules, NewUserModules } from '../user-modules.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserModules for edit and NewUserModulesFormGroupInput for create.
 */
type UserModulesFormGroupInput = IUserModules | PartialWithRequiredKeyOf<NewUserModules>;

type UserModulesFormDefaults = Pick<NewUserModules, 'id' | 'optional'>;

type UserModulesFormGroupContent = {
  id: FormControl<IUserModules['id'] | NewUserModules['id']>;
  moduleName: FormControl<IUserModules['moduleName']>;
  optional: FormControl<IUserModules['optional']>;
  studyYear: FormControl<IUserModules['studyYear']>;
};

export type UserModulesFormGroup = FormGroup<UserModulesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserModulesFormService {
  createUserModulesFormGroup(userModules: UserModulesFormGroupInput = { id: null }): UserModulesFormGroup {
    const userModulesRawValue = {
      ...this.getFormDefaults(),
      ...userModules,
    };
    return new FormGroup<UserModulesFormGroupContent>({
      id: new FormControl(
        { value: userModulesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      moduleName: new FormControl(userModulesRawValue.moduleName, {
        validators: [Validators.required],
      }),
      optional: new FormControl(userModulesRawValue.optional, {
        validators: [Validators.required],
      }),
      studyYear: new FormControl(userModulesRawValue.studyYear, {
        validators: [Validators.required, Validators.min(1), Validators.max(5)],
      }),
    });
  }

  getUserModules(form: UserModulesFormGroup): IUserModules | NewUserModules {
    return form.getRawValue() as IUserModules | NewUserModules;
  }

  resetForm(form: UserModulesFormGroup, userModules: UserModulesFormGroupInput): void {
    const userModulesRawValue = { ...this.getFormDefaults(), ...userModules };
    form.reset(
      {
        ...userModulesRawValue,
        id: { value: userModulesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserModulesFormDefaults {
    return {
      id: null,
      optional: false,
    };
  }
}
