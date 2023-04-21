import { IUserExtra, NewUserExtra } from './user-extra.model';

export const sampleWithRequiredData: IUserExtra = {
  id: 70254,
};

export const sampleWithPartialData: IUserExtra = {
  id: 95119,
  name: 'Accountability',
  bio: 'Pennsylvania array Legacy',
};

export const sampleWithFullData: IUserExtra = {
  id: 28084,
  name: 'Cotton',
  studyYear: 60333,
  bio: 'functionalities',
  pfp: 'indigo SCSI Cheese',
};

export const sampleWithNewData: NewUserExtra = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
