import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAppUsers, NewAppUsers } from '../app-users.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAppUsers for edit and NewAppUsersFormGroupInput for create.
 */
type AppUsersFormGroupInput = IAppUsers | PartialWithRequiredKeyOf<NewAppUsers>;

type AppUsersFormDefaults = Pick<NewAppUsers, 'id'>;

type AppUsersFormGroupContent = {
  id: FormControl<IAppUsers['id'] | NewAppUsers['id']>;
  name: FormControl<IAppUsers['name']>;
  studyYear: FormControl<IAppUsers['studyYear']>;
  bio: FormControl<IAppUsers['bio']>;
  pfp: FormControl<IAppUsers['pfp']>;
  subject: FormControl<IAppUsers['subject']>;
};

export type AppUsersFormGroup = FormGroup<AppUsersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AppUsersFormService {
  createAppUsersFormGroup(appUsers: AppUsersFormGroupInput = { id: null }): AppUsersFormGroup {
    const appUsersRawValue = {
      ...this.getFormDefaults(),
      ...appUsers,
    };
    return new FormGroup<AppUsersFormGroupContent>({
      id: new FormControl(
        { value: appUsersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(appUsersRawValue.name, {
        validators: [Validators.required],
      }),
      studyYear: new FormControl(appUsersRawValue.studyYear, {
        validators: [Validators.required, Validators.min(1), Validators.max(5)],
      }),
      bio: new FormControl(appUsersRawValue.bio),
      pfp: new FormControl(appUsersRawValue.pfp),
      subject: new FormControl(appUsersRawValue.subject),
    });
  }

  getAppUsers(form: AppUsersFormGroup): IAppUsers | NewAppUsers {
    return form.getRawValue() as IAppUsers | NewAppUsers;
  }

  resetForm(form: AppUsersFormGroup, appUsers: AppUsersFormGroupInput): void {
    const appUsersRawValue = { ...this.getFormDefaults(), ...appUsers };
    form.reset(
      {
        ...appUsersRawValue,
        id: { value: appUsersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AppUsersFormDefaults {
    return {
      id: null,
    };
  }
}
