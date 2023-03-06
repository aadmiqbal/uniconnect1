import { IModuleLink, NewModuleLink } from './module-link.model';

export const sampleWithRequiredData: IModuleLink = {
  id: 80997,
};

export const sampleWithPartialData: IModuleLink = {
  id: 50201,
};

export const sampleWithFullData: IModuleLink = {
  id: 38337,
};

export const sampleWithNewData: NewModuleLink = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
