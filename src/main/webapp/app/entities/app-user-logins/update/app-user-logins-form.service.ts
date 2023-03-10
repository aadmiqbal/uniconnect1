import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAppUserLogins, NewAppUserLogins } from '../app-user-logins.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAppUserLogins for edit and NewAppUserLoginsFormGroupInput for create.
 */
type AppUserLoginsFormGroupInput = IAppUserLogins | PartialWithRequiredKeyOf<NewAppUserLogins>;

type AppUserLoginsFormDefaults = Pick<NewAppUserLogins, 'id'>;

type AppUserLoginsFormGroupContent = {
  id: FormControl<IAppUserLogins['id'] | NewAppUserLogins['id']>;
  userEmail: FormControl<IAppUserLogins['userEmail']>;
  passwordSalt: FormControl<IAppUserLogins['passwordSalt']>;
  passwordHash: FormControl<IAppUserLogins['passwordHash']>;
  appUser: FormControl<IAppUserLogins['appUser']>;
};

export type AppUserLoginsFormGroup = FormGroup<AppUserLoginsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AppUserLoginsFormService {
  createAppUserLoginsFormGroup(appUserLogins: AppUserLoginsFormGroupInput = { id: null }): AppUserLoginsFormGroup {
    const appUserLoginsRawValue = {
      ...this.getFormDefaults(),
      ...appUserLogins,
    };
    return new FormGroup<AppUserLoginsFormGroupContent>({
      id: new FormControl(
        { value: appUserLoginsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userEmail: new FormControl(appUserLoginsRawValue.userEmail, {
        validators: [Validators.required],
      }),
      passwordSalt: new FormControl(appUserLoginsRawValue.passwordSalt, {
        validators: [Validators.required],
      }),
      passwordHash: new FormControl(appUserLoginsRawValue.passwordHash, {
        validators: [Validators.required],
      }),
      appUser: new FormControl(appUserLoginsRawValue.appUser),
    });
  }

  getAppUserLogins(form: AppUserLoginsFormGroup): IAppUserLogins | NewAppUserLogins {
    return form.getRawValue() as IAppUserLogins | NewAppUserLogins;
  }

  resetForm(form: AppUserLoginsFormGroup, appUserLogins: AppUserLoginsFormGroupInput): void {
    const appUserLoginsRawValue = { ...this.getFormDefaults(), ...appUserLogins };
    form.reset(
      {
        ...appUserLoginsRawValue,
        id: { value: appUserLoginsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AppUserLoginsFormDefaults {
    return {
      id: null,
    };
  }
}
