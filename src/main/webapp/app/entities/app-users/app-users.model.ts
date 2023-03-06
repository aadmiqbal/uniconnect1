export interface IAppUsers {
  id: number;
  name?: string | null;
  studyYear?: number | null;
  bio?: string | null;
  pfp?: string | null;
}

export type NewAppUsers = Omit<IAppUsers, 'id'> & { id: null };
