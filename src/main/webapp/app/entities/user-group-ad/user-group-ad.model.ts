import { IUserGroups } from 'app/entities/user-groups/user-groups.model';

export interface IUserGroupAd {
  id: number;
  groupBio?: string | null;
  group?: Pick<IUserGroups, 'id'> | null;
}

export type NewUserGroupAd = Omit<IUserGroupAd, 'id'> & { id: null };
