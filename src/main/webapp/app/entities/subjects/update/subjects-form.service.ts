import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISubjects, NewSubjects } from '../subjects.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISubjects for edit and NewSubjectsFormGroupInput for create.
 */
type SubjectsFormGroupInput = ISubjects | PartialWithRequiredKeyOf<NewSubjects>;

type SubjectsFormDefaults = Pick<NewSubjects, 'id'>;

type SubjectsFormGroupContent = {
  id: FormControl<ISubjects['id'] | NewSubjects['id']>;
  subjectName: FormControl<ISubjects['subjectName']>;
};

export type SubjectsFormGroup = FormGroup<SubjectsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SubjectsFormService {
  createSubjectsFormGroup(subjects: SubjectsFormGroupInput = { id: null }): SubjectsFormGroup {
    const subjectsRawValue = {
      ...this.getFormDefaults(),
      ...subjects,
    };
    return new FormGroup<SubjectsFormGroupContent>({
      id: new FormControl(
        { value: subjectsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      subjectName: new FormControl(subjectsRawValue.subjectName, {
        validators: [Validators.required],
      }),
    });
  }

  getSubjects(form: SubjectsFormGroup): ISubjects | NewSubjects {
    return form.getRawValue() as ISubjects | NewSubjects;
  }

  resetForm(form: SubjectsFormGroup, subjects: SubjectsFormGroupInput): void {
    const subjectsRawValue = { ...this.getFormDefaults(), ...subjects };
    form.reset(
      {
        ...subjectsRawValue,
        id: { value: subjectsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SubjectsFormDefaults {
    return {
      id: null,
    };
  }
}
