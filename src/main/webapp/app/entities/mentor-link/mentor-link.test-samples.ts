import { IMentorLink, NewMentorLink } from './mentor-link.model';

export const sampleWithRequiredData: IMentorLink = {
  id: 44274,
};

export const sampleWithPartialData: IMentorLink = {
  id: 24597,
};

export const sampleWithFullData: IMentorLink = {
  id: 77576,
};

export const sampleWithNewData: NewMentorLink = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
