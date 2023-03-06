import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { IAppUsers } from 'app/entities/app-users/app-users.model';

export interface IMentors {
  id: number;
  module?: Pick<IUserModules, 'id'> | null;
  mentorUser?: Pick<IAppUsers, 'id'> | null;
}

export type NewMentors = Omit<IMentors, 'id'> & { id: null };
