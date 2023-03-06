import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDegreeSubjects, NewDegreeSubjects } from '../degree-subjects.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDegreeSubjects for edit and NewDegreeSubjectsFormGroupInput for create.
 */
type DegreeSubjectsFormGroupInput = IDegreeSubjects | PartialWithRequiredKeyOf<NewDegreeSubjects>;

type DegreeSubjectsFormDefaults = Pick<NewDegreeSubjects, 'id'>;

type DegreeSubjectsFormGroupContent = {
  id: FormControl<IDegreeSubjects['id'] | NewDegreeSubjects['id']>;
  degree: FormControl<IDegreeSubjects['degree']>;
  subject: FormControl<IDegreeSubjects['subject']>;
};

export type DegreeSubjectsFormGroup = FormGroup<DegreeSubjectsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DegreeSubjectsFormService {
  createDegreeSubjectsFormGroup(degreeSubjects: DegreeSubjectsFormGroupInput = { id: null }): DegreeSubjectsFormGroup {
    const degreeSubjectsRawValue = {
      ...this.getFormDefaults(),
      ...degreeSubjects,
    };
    return new FormGroup<DegreeSubjectsFormGroupContent>({
      id: new FormControl(
        { value: degreeSubjectsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      degree: new FormControl(degreeSubjectsRawValue.degree),
      subject: new FormControl(degreeSubjectsRawValue.subject),
    });
  }

  getDegreeSubjects(form: DegreeSubjectsFormGroup): IDegreeSubjects | NewDegreeSubjects {
    return form.getRawValue() as IDegreeSubjects | NewDegreeSubjects;
  }

  resetForm(form: DegreeSubjectsFormGroup, degreeSubjects: DegreeSubjectsFormGroupInput): void {
    const degreeSubjectsRawValue = { ...this.getFormDefaults(), ...degreeSubjects };
    form.reset(
      {
        ...degreeSubjectsRawValue,
        id: { value: degreeSubjectsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DegreeSubjectsFormDefaults {
    return {
      id: null,
    };
  }
}
