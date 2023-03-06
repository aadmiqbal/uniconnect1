import { IUserGroups, NewUserGroups } from './user-groups.model';

export const sampleWithRequiredData: IUserGroups = {
  id: 67096,
  groupName: 'clicks-and-mortar Kids',
};

export const sampleWithPartialData: IUserGroups = {
  id: 53125,
  groupName: 'Accounts',
};

export const sampleWithFullData: IUserGroups = {
  id: 97388,
  groupName: 'Mouse Port Configurable',
};

export const sampleWithNewData: NewUserGroups = {
  groupName: 'Fresh Illinois',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
