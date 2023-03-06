import { IUserModules } from 'app/entities/user-modules/user-modules.model';
import { IAppUsers } from 'app/entities/app-users/app-users.model';

export interface IModuleLink {
  id: number;
  optionalModule?: Pick<IUserModules, 'id'> | null;
  optionalModuleUser?: Pick<IAppUsers, 'id'> | null;
}

export type NewModuleLink = Omit<IModuleLink, 'id'> & { id: null };
