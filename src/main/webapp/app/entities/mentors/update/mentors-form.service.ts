import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMentors, NewMentors } from '../mentors.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMentors for edit and NewMentorsFormGroupInput for create.
 */
type MentorsFormGroupInput = IMentors | PartialWithRequiredKeyOf<NewMentors>;

type MentorsFormDefaults = Pick<NewMentors, 'id'>;

type MentorsFormGroupContent = {
  id: FormControl<IMentors['id'] | NewMentors['id']>;
  module: FormControl<IMentors['module']>;
  mentorUser: FormControl<IMentors['mentorUser']>;
};

export type MentorsFormGroup = FormGroup<MentorsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MentorsFormService {
  createMentorsFormGroup(mentors: MentorsFormGroupInput = { id: null }): MentorsFormGroup {
    const mentorsRawValue = {
      ...this.getFormDefaults(),
      ...mentors,
    };
    return new FormGroup<MentorsFormGroupContent>({
      id: new FormControl(
        { value: mentorsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      module: new FormControl(mentorsRawValue.module),
      mentorUser: new FormControl(mentorsRawValue.mentorUser),
    });
  }

  getMentors(form: MentorsFormGroup): IMentors | NewMentors {
    return form.getRawValue() as IMentors | NewMentors;
  }

  resetForm(form: MentorsFormGroup, mentors: MentorsFormGroupInput): void {
    const mentorsRawValue = { ...this.getFormDefaults(), ...mentors };
    form.reset(
      {
        ...mentorsRawValue,
        id: { value: mentorsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MentorsFormDefaults {
    return {
      id: null,
    };
  }
}
