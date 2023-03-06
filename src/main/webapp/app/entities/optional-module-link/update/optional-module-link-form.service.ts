import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOptionalModuleLink, NewOptionalModuleLink } from '../optional-module-link.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOptionalModuleLink for edit and NewOptionalModuleLinkFormGroupInput for create.
 */
type OptionalModuleLinkFormGroupInput = IOptionalModuleLink | PartialWithRequiredKeyOf<NewOptionalModuleLink>;

type OptionalModuleLinkFormDefaults = Pick<NewOptionalModuleLink, 'id'>;

type OptionalModuleLinkFormGroupContent = {
  id: FormControl<IOptionalModuleLink['id'] | NewOptionalModuleLink['id']>;
  optionalModule: FormControl<IOptionalModuleLink['optionalModule']>;
  optionalModuleUser: FormControl<IOptionalModuleLink['optionalModuleUser']>;
};

export type OptionalModuleLinkFormGroup = FormGroup<OptionalModuleLinkFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OptionalModuleLinkFormService {
  createOptionalModuleLinkFormGroup(optionalModuleLink: OptionalModuleLinkFormGroupInput = { id: null }): OptionalModuleLinkFormGroup {
    const optionalModuleLinkRawValue = {
      ...this.getFormDefaults(),
      ...optionalModuleLink,
    };
    return new FormGroup<OptionalModuleLinkFormGroupContent>({
      id: new FormControl(
        { value: optionalModuleLinkRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      optionalModule: new FormControl(optionalModuleLinkRawValue.optionalModule),
      optionalModuleUser: new FormControl(optionalModuleLinkRawValue.optionalModuleUser),
    });
  }

  getOptionalModuleLink(form: OptionalModuleLinkFormGroup): IOptionalModuleLink | NewOptionalModuleLink {
    return form.getRawValue() as IOptionalModuleLink | NewOptionalModuleLink;
  }

  resetForm(form: OptionalModuleLinkFormGroup, optionalModuleLink: OptionalModuleLinkFormGroupInput): void {
    const optionalModuleLinkRawValue = { ...this.getFormDefaults(), ...optionalModuleLink };
    form.reset(
      {
        ...optionalModuleLinkRawValue,
        id: { value: optionalModuleLinkRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OptionalModuleLinkFormDefaults {
    return {
      id: null,
    };
  }
}
