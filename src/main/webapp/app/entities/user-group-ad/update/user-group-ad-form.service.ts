import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserGroupAd, NewUserGroupAd } from '../user-group-ad.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserGroupAd for edit and NewUserGroupAdFormGroupInput for create.
 */
type UserGroupAdFormGroupInput = IUserGroupAd | PartialWithRequiredKeyOf<NewUserGroupAd>;

type UserGroupAdFormDefaults = Pick<NewUserGroupAd, 'id'>;

type UserGroupAdFormGroupContent = {
  id: FormControl<IUserGroupAd['id'] | NewUserGroupAd['id']>;
  groupBio: FormControl<IUserGroupAd['groupBio']>;
  group: FormControl<IUserGroupAd['group']>;
};

export type UserGroupAdFormGroup = FormGroup<UserGroupAdFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserGroupAdFormService {
  createUserGroupAdFormGroup(userGroupAd: UserGroupAdFormGroupInput = { id: null }): UserGroupAdFormGroup {
    const userGroupAdRawValue = {
      ...this.getFormDefaults(),
      ...userGroupAd,
    };
    return new FormGroup<UserGroupAdFormGroupContent>({
      id: new FormControl(
        { value: userGroupAdRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      groupBio: new FormControl(userGroupAdRawValue.groupBio),
      group: new FormControl(userGroupAdRawValue.group),
    });
  }

  getUserGroupAd(form: UserGroupAdFormGroup): IUserGroupAd | NewUserGroupAd {
    return form.getRawValue() as IUserGroupAd | NewUserGroupAd;
  }

  resetForm(form: UserGroupAdFormGroup, userGroupAd: UserGroupAdFormGroupInput): void {
    const userGroupAdRawValue = { ...this.getFormDefaults(), ...userGroupAd };
    form.reset(
      {
        ...userGroupAdRawValue,
        id: { value: userGroupAdRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserGroupAdFormDefaults {
    return {
      id: null,
    };
  }
}
