import { IUserExtra, NewUserExtra } from './user-extra.model';

export const sampleWithRequiredData: IUserExtra = {
  id: 70254,
};

export const sampleWithPartialData: IUserExtra = {
  id: 95119,
  name: 'THX Pennsylvania array',
  bio: 'capacitor Cotton Money',
};

export const sampleWithFullData: IUserExtra = {
  id: 28084,
  name: '1080p primary',
  studyYear: 89414,
  bio: 'Cheese payment',
  pfp: 'scalable mission-critical Pizza',
  modules: 'Analyst Mississippi',
};

export const sampleWithNewData: NewUserExtra = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
