import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMentorLink, NewMentorLink } from '../mentor-link.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMentorLink for edit and NewMentorLinkFormGroupInput for create.
 */
type MentorLinkFormGroupInput = IMentorLink | PartialWithRequiredKeyOf<NewMentorLink>;

type MentorLinkFormDefaults = Pick<NewMentorLink, 'id'>;

type MentorLinkFormGroupContent = {
  id: FormControl<IMentorLink['id'] | NewMentorLink['id']>;
  mentor: FormControl<IMentorLink['mentor']>;
  mentee: FormControl<IMentorLink['mentee']>;
};

export type MentorLinkFormGroup = FormGroup<MentorLinkFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MentorLinkFormService {
  createMentorLinkFormGroup(mentorLink: MentorLinkFormGroupInput = { id: null }): MentorLinkFormGroup {
    const mentorLinkRawValue = {
      ...this.getFormDefaults(),
      ...mentorLink,
    };
    return new FormGroup<MentorLinkFormGroupContent>({
      id: new FormControl(
        { value: mentorLinkRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      mentor: new FormControl(mentorLinkRawValue.mentor),
      mentee: new FormControl(mentorLinkRawValue.mentee),
    });
  }

  getMentorLink(form: MentorLinkFormGroup): IMentorLink | NewMentorLink {
    return form.getRawValue() as IMentorLink | NewMentorLink;
  }

  resetForm(form: MentorLinkFormGroup, mentorLink: MentorLinkFormGroupInput): void {
    const mentorLinkRawValue = { ...this.getFormDefaults(), ...mentorLink };
    form.reset(
      {
        ...mentorLinkRawValue,
        id: { value: mentorLinkRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MentorLinkFormDefaults {
    return {
      id: null,
    };
  }
}
