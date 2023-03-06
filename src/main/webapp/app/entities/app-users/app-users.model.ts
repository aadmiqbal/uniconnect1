import { IDegrees } from 'app/entities/degrees/degrees.model';

export interface IAppUsers {
  id: number;
  name?: string | null;
  studyYear?: number | null;
  bio?: string | null;
  pfp?: string | null;
  subject?: Pick<IDegrees, 'id'> | null;
}

export type NewAppUsers = Omit<IAppUsers, 'id'> & { id: null };
