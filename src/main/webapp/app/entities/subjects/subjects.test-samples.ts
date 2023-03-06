import { ISubjects, NewSubjects } from './subjects.model';

export const sampleWithRequiredData: ISubjects = {
  id: 76398,
  subjectName: 'Avon synthesize Fresh',
};

export const sampleWithPartialData: ISubjects = {
  id: 34108,
  subjectName: 'Fresh Outdoors syndicate',
};

export const sampleWithFullData: ISubjects = {
  id: 64053,
  subjectName: 'Renminbi Dollar Movies',
};

export const sampleWithNewData: NewSubjects = {
  subjectName: 'grey',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
