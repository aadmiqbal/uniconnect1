import { IUserGroupAd, NewUserGroupAd } from './user-group-ad.model';

export const sampleWithRequiredData: IUserGroupAd = {
  id: 87616,
};

export const sampleWithPartialData: IUserGroupAd = {
  id: 73382,
  groupBio: 'transform quantifying',
};

export const sampleWithFullData: IUserGroupAd = {
  id: 59719,
  groupBio: 'Loan cross-media Shoes',
};

export const sampleWithNewData: NewUserGroupAd = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
