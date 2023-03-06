import { IUserGroups } from 'app/entities/user-groups/user-groups.model';
import { IAppUsers } from 'app/entities/app-users/app-users.model';

export interface IUserGroupUsers {
  id: number;
  group?: Pick<IUserGroups, 'id'> | null;
  user?: Pick<IAppUsers, 'id'> | null;
}

export type NewUserGroupUsers = Omit<IUserGroupUsers, 'id'> & { id: null };
