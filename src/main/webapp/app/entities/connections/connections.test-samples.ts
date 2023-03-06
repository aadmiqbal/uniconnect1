import { IConnections, NewConnections } from './connections.model';

export const sampleWithRequiredData: IConnections = {
  id: 12834,
};

export const sampleWithPartialData: IConnections = {
  id: 58179,
};

export const sampleWithFullData: IConnections = {
  id: 64936,
};

export const sampleWithNewData: NewConnections = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
