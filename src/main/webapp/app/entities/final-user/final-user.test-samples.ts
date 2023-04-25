import { IFinalUser, NewFinalUser } from './final-user.model';

export const sampleWithRequiredData: IFinalUser = {
  id: 67826,
};

export const sampleWithPartialData: IFinalUser = {
  id: 85823,
  name: 'California',
  pfp: 'haptic transmit high-level',
  lastName: 'Rau',
};

export const sampleWithFullData: IFinalUser = {
  id: 52209,
  name: 'deposit clicks-and-mortar core',
  studyYear: 77472,
  bio: 'maroon Representative',
  pfp: 'Liechtenstein',
  modules: 'Lead infrastructures',
  firstName: 'Lawrence',
  lastName: 'Schuppe',
};

export const sampleWithNewData: NewFinalUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
