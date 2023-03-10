import { IAppUsers } from 'app/entities/app-users/app-users.model';

export interface IAppUserLogins {
  id: number;
  userEmail?: string | null;
  passwordSalt?: string | null;
  passwordHash?: string | null;
  appUser?: Pick<IAppUsers, 'id'> | null;
}

export type NewAppUserLogins = Omit<IAppUserLogins, 'id'> & { id: null };
