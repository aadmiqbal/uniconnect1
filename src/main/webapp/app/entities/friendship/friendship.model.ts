import { IFinalUser } from 'app/entities/final-user/final-user.model';

export interface IFriendship {
  id: number;
  finalUser?: Pick<IFinalUser, 'id'> | null;
  finalUser2?: Pick<IFinalUser, 'id'> | null;
}

export type NewFriendship = Omit<IFriendship, 'id'> & { id: null };
