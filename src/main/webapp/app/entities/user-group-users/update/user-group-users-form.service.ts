import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserGroupUsers, NewUserGroupUsers } from '../user-group-users.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserGroupUsers for edit and NewUserGroupUsersFormGroupInput for create.
 */
type UserGroupUsersFormGroupInput = IUserGroupUsers | PartialWithRequiredKeyOf<NewUserGroupUsers>;

type UserGroupUsersFormDefaults = Pick<NewUserGroupUsers, 'id'>;

type UserGroupUsersFormGroupContent = {
  id: FormControl<IUserGroupUsers['id'] | NewUserGroupUsers['id']>;
  group: FormControl<IUserGroupUsers['group']>;
  user: FormControl<IUserGroupUsers['user']>;
};

export type UserGroupUsersFormGroup = FormGroup<UserGroupUsersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserGroupUsersFormService {
  createUserGroupUsersFormGroup(userGroupUsers: UserGroupUsersFormGroupInput = { id: null }): UserGroupUsersFormGroup {
    const userGroupUsersRawValue = {
      ...this.getFormDefaults(),
      ...userGroupUsers,
    };
    return new FormGroup<UserGroupUsersFormGroupContent>({
      id: new FormControl(
        { value: userGroupUsersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      group: new FormControl(userGroupUsersRawValue.group),
      user: new FormControl(userGroupUsersRawValue.user),
    });
  }

  getUserGroupUsers(form: UserGroupUsersFormGroup): IUserGroupUsers | NewUserGroupUsers {
    return form.getRawValue() as IUserGroupUsers | NewUserGroupUsers;
  }

  resetForm(form: UserGroupUsersFormGroup, userGroupUsers: UserGroupUsersFormGroupInput): void {
    const userGroupUsersRawValue = { ...this.getFormDefaults(), ...userGroupUsers };
    form.reset(
      {
        ...userGroupUsersRawValue,
        id: { value: userGroupUsersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserGroupUsersFormDefaults {
    return {
      id: null,
    };
  }
}
