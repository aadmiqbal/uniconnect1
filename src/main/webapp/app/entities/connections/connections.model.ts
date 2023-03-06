import { IAppUsers } from 'app/entities/app-users/app-users.model';

export interface IConnections {
  id: number;
  user1?: Pick<IAppUsers, 'id'> | null;
  user2?: Pick<IAppUsers, 'id'> | null;
}

export type NewConnections = Omit<IConnections, 'id'> & { id: null };
