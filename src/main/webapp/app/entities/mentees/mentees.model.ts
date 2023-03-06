import { IAppUsers } from 'app/entities/app-users/app-users.model';

export interface IMentees {
  id: number;
  menteeUser?: Pick<IAppUsers, 'id'> | null;
}

export type NewMentees = Omit<IMentees, 'id'> & { id: null };
