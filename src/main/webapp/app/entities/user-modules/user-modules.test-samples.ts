import { IUserModules, NewUserModules } from './user-modules.model';

export const sampleWithRequiredData: IUserModules = {
  id: 39591,
  moduleName: 'Granite Streamlined',
  optional: true,
  studyYear: 1,
};

export const sampleWithPartialData: IUserModules = {
  id: 45849,
  moduleName: 'aggregate Pound payment',
  optional: false,
  studyYear: 3,
};

export const sampleWithFullData: IUserModules = {
  id: 89368,
  moduleName: 'rich',
  optional: false,
  studyYear: 3,
};

export const sampleWithNewData: NewUserModules = {
  moduleName: 'Junction Home',
  optional: false,
  studyYear: 1,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
