import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { IAppUsers } from 'app/entities/app-users/app-users.model';

export interface IOptionalModuleLink {
  id: number;
  optionalModule?: Pick<IUserModules, 'id'> | null;
  optionalModuleUser?: Pick<IAppUsers, 'id'> | null;
}

export type NewOptionalModuleLink = Omit<IOptionalModuleLink, 'id'> & { id: null };
