import { IOptionalModuleLink, NewOptionalModuleLink } from './optional-module-link.model';

export const sampleWithRequiredData: IOptionalModuleLink = {
  id: 16751,
};

export const sampleWithPartialData: IOptionalModuleLink = {
  id: 32309,
};

export const sampleWithFullData: IOptionalModuleLink = {
  id: 59391,
};

export const sampleWithNewData: NewOptionalModuleLink = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
