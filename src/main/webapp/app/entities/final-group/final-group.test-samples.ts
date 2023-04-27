import { IFinalGroup, NewFinalGroup } from './final-group.model';

export const sampleWithRequiredData: IFinalGroup = {
  id: 28686,
};

export const sampleWithPartialData: IFinalGroup = {
  id: 87433,
  name: 'Money quantify',
  admins: 'Coordinator Handcrafted',
};

export const sampleWithFullData: IFinalGroup = {
  id: 46836,
  name: 'calculate Rustic Associate',
  members: 'Cheese',
  isAdvertised: false,
  groupDescription: 'Pants indexing Liberia',
  pfp: 'incentivize',
  admins: 'Chief',
};

export const sampleWithNewData: NewFinalGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
