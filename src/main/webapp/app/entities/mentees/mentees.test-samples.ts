import { IMentees, NewMentees } from './mentees.model';

export const sampleWithRequiredData: IMentees = {
  id: 37160,
};

export const sampleWithPartialData: IMentees = {
  id: 72067,
};

export const sampleWithFullData: IMentees = {
  id: 53770,
};

export const sampleWithNewData: NewMentees = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
