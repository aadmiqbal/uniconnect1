import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserGroups, NewUserGroups } from '../user-groups.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserGroups for edit and NewUserGroupsFormGroupInput for create.
 */
type UserGroupsFormGroupInput = IUserGroups | PartialWithRequiredKeyOf<NewUserGroups>;

type UserGroupsFormDefaults = Pick<NewUserGroups, 'id'>;

type UserGroupsFormGroupContent = {
  id: FormControl<IUserGroups['id'] | NewUserGroups['id']>;
  groupName: FormControl<IUserGroups['groupName']>;
};

export type UserGroupsFormGroup = FormGroup<UserGroupsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserGroupsFormService {
  createUserGroupsFormGroup(userGroups: UserGroupsFormGroupInput = { id: null }): UserGroupsFormGroup {
    const userGroupsRawValue = {
      ...this.getFormDefaults(),
      ...userGroups,
    };
    return new FormGroup<UserGroupsFormGroupContent>({
      id: new FormControl(
        { value: userGroupsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      groupName: new FormControl(userGroupsRawValue.groupName, {
        validators: [Validators.required],
      }),
    });
  }

  getUserGroups(form: UserGroupsFormGroup): IUserGroups | NewUserGroups {
    return form.getRawValue() as IUserGroups | NewUserGroups;
  }

  resetForm(form: UserGroupsFormGroup, userGroups: UserGroupsFormGroupInput): void {
    const userGroupsRawValue = { ...this.getFormDefaults(), ...userGroups };
    form.reset(
      {
        ...userGroupsRawValue,
        id: { value: userGroupsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserGroupsFormDefaults {
    return {
      id: null,
    };
  }
}
