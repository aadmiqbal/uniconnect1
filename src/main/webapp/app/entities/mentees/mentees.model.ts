import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { IAppUsers } from 'app/entities/app-users/app-users.model';

export interface IMentees {
  id: number;
  module?: Pick<IUserModules, 'id'> | null;
  menteeUser?: Pick<IAppUsers, 'id'> | null;
}

export type NewMentees = Omit<IMentees, 'id'> & { id: null };
