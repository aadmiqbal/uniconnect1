import { IAppUserLogins, NewAppUserLogins } from './app-user-logins.model';

export const sampleWithRequiredData: IAppUserLogins = {
  id: 30641,
  userEmail: 'real-time',
  passwordSalt: 'transmit Florida Integration',
  passwordHash: 'SCSI Tuna Computer',
};

export const sampleWithPartialData: IAppUserLogins = {
  id: 70716,
  userEmail: 'Springs Concrete Kip',
  passwordSalt: 'blockchains',
  passwordHash: 'Garden system',
};

export const sampleWithFullData: IAppUserLogins = {
  id: 1576,
  userEmail: 'SCSI Investment',
  passwordSalt: 'Technician Dakota',
  passwordHash: 'back-end',
};

export const sampleWithNewData: NewAppUserLogins = {
  userEmail: 'Shirt payment leverage',
  passwordSalt: 'azure array protocol',
  passwordHash: 'deposit fuchsia web-enabled',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
