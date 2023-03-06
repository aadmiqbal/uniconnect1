import { IDegreeSubjects, NewDegreeSubjects } from './degree-subjects.model';

export const sampleWithRequiredData: IDegreeSubjects = {
  id: 19099,
};

export const sampleWithPartialData: IDegreeSubjects = {
  id: 76415,
};

export const sampleWithFullData: IDegreeSubjects = {
  id: 59506,
};

export const sampleWithNewData: NewDegreeSubjects = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
