import { IUserExtra, NewUserExtra } from './user-extra.model';

export const sampleWithRequiredData: IUserExtra = {
  id: 70254,
};

export const sampleWithPartialData: IUserExtra = {
  id: 95119,
  name: 'generating orchestration',
  bio: 'Legacy',
  firstName: 'Braulio',
  lastName: 'Baumbach',
};

export const sampleWithFullData: IUserExtra = {
  id: 28084,
  name: 'architectures',
  studyYear: 60333,
  bio: 'functionalities',
  pfp: 'indigo SCSI Cheese',
  modules: 'Bhutan scalable',
  firstName: 'Ezekiel',
  lastName: 'Dickinson',
};

export const sampleWithNewData: NewUserExtra = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
