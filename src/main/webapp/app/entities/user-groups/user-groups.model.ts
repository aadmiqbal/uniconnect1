export interface IUserGroups {
  id: number;
  groupName?: string | null;
}

export type NewUserGroups = Omit<IUserGroups, 'id'> & { id: null };
