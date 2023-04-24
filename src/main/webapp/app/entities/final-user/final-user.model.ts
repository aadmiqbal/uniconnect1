import { IUser } from 'app/entities/user/user.model';

export interface IFinalUser {
  id: number;
  name?: string | null;
  studyYear?: number | null;
  bio?: string | null;
  pfp?: string | null;
  modules?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewFinalUser = Omit<IFinalUser, 'id'> & { id: null };
