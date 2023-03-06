import { IMentors, NewMentors } from './mentors.model';

export const sampleWithRequiredData: IMentors = {
  id: 3762,
};

export const sampleWithPartialData: IMentors = {
  id: 19763,
};

export const sampleWithFullData: IMentors = {
  id: 70108,
};

export const sampleWithNewData: NewMentors = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
