import { IUserGroupUsers, NewUserGroupUsers } from './user-group-users.model';

export const sampleWithRequiredData: IUserGroupUsers = {
  id: 36235,
};

export const sampleWithPartialData: IUserGroupUsers = {
  id: 83538,
};

export const sampleWithFullData: IUserGroupUsers = {
  id: 45904,
};

export const sampleWithNewData: NewUserGroupUsers = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
