import { IAppUsers, NewAppUsers } from './app-users.model';

export const sampleWithRequiredData: IAppUsers = {
  id: 28884,
  name: 'Gorgeous Practical Agent',
  studyYear: 1,
};

export const sampleWithPartialData: IAppUsers = {
  id: 29658,
  name: 'Denar',
  studyYear: 1,
  pfp: 'strategy Consultant',
};

export const sampleWithFullData: IAppUsers = {
  id: 15989,
  name: 'Money Path Gold',
  studyYear: 3,
  bio: 'Naira Borders Borders',
  pfp: 'morph content Steel',
};

export const sampleWithNewData: NewAppUsers = {
  name: 'multi-state Customer-focused Directives',
  studyYear: 3,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
