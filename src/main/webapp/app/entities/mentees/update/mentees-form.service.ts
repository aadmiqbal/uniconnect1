import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMentees, NewMentees } from '../mentees.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMentees for edit and NewMenteesFormGroupInput for create.
 */
type MenteesFormGroupInput = IMentees | PartialWithRequiredKeyOf<NewMentees>;

type MenteesFormDefaults = Pick<NewMentees, 'id'>;

type MenteesFormGroupContent = {
  id: FormControl<IMentees['id'] | NewMentees['id']>;
  menteeUser: FormControl<IMentees['menteeUser']>;
};

export type MenteesFormGroup = FormGroup<MenteesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MenteesFormService {
  createMenteesFormGroup(mentees: MenteesFormGroupInput = { id: null }): MenteesFormGroup {
    const menteesRawValue = {
      ...this.getFormDefaults(),
      ...mentees,
    };
    return new FormGroup<MenteesFormGroupContent>({
      id: new FormControl(
        { value: menteesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      menteeUser: new FormControl(menteesRawValue.menteeUser),
    });
  }

  getMentees(form: MenteesFormGroup): IMentees | NewMentees {
    return form.getRawValue() as IMentees | NewMentees;
  }

  resetForm(form: MenteesFormGroup, mentees: MenteesFormGroupInput): void {
    const menteesRawValue = { ...this.getFormDefaults(), ...mentees };
    form.reset(
      {
        ...menteesRawValue,
        id: { value: menteesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MenteesFormDefaults {
    return {
      id: null,
    };
  }
}
