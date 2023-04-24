import { IUser } from 'app/entities/user/user.model';

export interface IUserExtra {
  id: number;
  name?: string | null;
  studyYear?: number | null;
  bio?: string | null;
  pfp?: string | null;
  modules?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewUserExtra = Omit<IUserExtra, 'id'> & { id: null };
