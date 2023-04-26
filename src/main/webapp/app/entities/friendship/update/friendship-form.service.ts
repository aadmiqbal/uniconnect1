import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFriendship, NewFriendship } from '../friendship.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFriendship for edit and NewFriendshipFormGroupInput for create.
 */
type FriendshipFormGroupInput = IFriendship | PartialWithRequiredKeyOf<NewFriendship>;

type FriendshipFormDefaults = Pick<NewFriendship, 'id'>;

type FriendshipFormGroupContent = {
  id: FormControl<IFriendship['id'] | NewFriendship['id']>;
  finalUser: FormControl<IFriendship['finalUser']>;
  finalUser2: FormControl<IFriendship['finalUser2']>;
};

export type FriendshipFormGroup = FormGroup<FriendshipFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FriendshipFormService {
  createFriendshipFormGroup(friendship: FriendshipFormGroupInput = { id: null }): FriendshipFormGroup {
    const friendshipRawValue = {
      ...this.getFormDefaults(),
      ...friendship,
    };
    return new FormGroup<FriendshipFormGroupContent>({
      id: new FormControl(
        { value: friendshipRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      finalUser: new FormControl(friendshipRawValue.finalUser),
      finalUser2: new FormControl(friendshipRawValue.finalUser2),
    });
  }

  getFriendship(form: FriendshipFormGroup): IFriendship | NewFriendship {
    return form.getRawValue() as IFriendship | NewFriendship;
  }

  resetForm(form: FriendshipFormGroup, friendship: FriendshipFormGroupInput): void {
    const friendshipRawValue = { ...this.getFormDefaults(), ...friendship };
    form.reset(
      {
        ...friendshipRawValue,
        id: { value: friendshipRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FriendshipFormDefaults {
    return {
      id: null,
    };
  }
}
