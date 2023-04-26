import { IFriendship, NewFriendship } from './friendship.model';

export const sampleWithRequiredData: IFriendship = {
  id: 12823,
};

export const sampleWithPartialData: IFriendship = {
  id: 52454,
};

export const sampleWithFullData: IFriendship = {
  id: 88722,
};

export const sampleWithNewData: NewFriendship = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
