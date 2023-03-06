import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IModuleLink, NewModuleLink } from '../module-link.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IModuleLink for edit and NewModuleLinkFormGroupInput for create.
 */
type ModuleLinkFormGroupInput = IModuleLink | PartialWithRequiredKeyOf<NewModuleLink>;

type ModuleLinkFormDefaults = Pick<NewModuleLink, 'id'>;

type ModuleLinkFormGroupContent = {
  id: FormControl<IModuleLink['id'] | NewModuleLink['id']>;
  optionalModule: FormControl<IModuleLink['optionalModule']>;
  optionalModuleUser: FormControl<IModuleLink['optionalModuleUser']>;
};

export type ModuleLinkFormGroup = FormGroup<ModuleLinkFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ModuleLinkFormService {
  createModuleLinkFormGroup(moduleLink: ModuleLinkFormGroupInput = { id: null }): ModuleLinkFormGroup {
    const moduleLinkRawValue = {
      ...this.getFormDefaults(),
      ...moduleLink,
    };
    return new FormGroup<ModuleLinkFormGroupContent>({
      id: new FormControl(
        { value: moduleLinkRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      optionalModule: new FormControl(moduleLinkRawValue.optionalModule),
      optionalModuleUser: new FormControl(moduleLinkRawValue.optionalModuleUser),
    });
  }

  getModuleLink(form: ModuleLinkFormGroup): IModuleLink | NewModuleLink {
    return form.getRawValue() as IModuleLink | NewModuleLink;
  }

  resetForm(form: ModuleLinkFormGroup, moduleLink: ModuleLinkFormGroupInput): void {
    const moduleLinkRawValue = { ...this.getFormDefaults(), ...moduleLink };
    form.reset(
      {
        ...moduleLinkRawValue,
        id: { value: moduleLinkRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ModuleLinkFormDefaults {
    return {
      id: null,
    };
  }
}
