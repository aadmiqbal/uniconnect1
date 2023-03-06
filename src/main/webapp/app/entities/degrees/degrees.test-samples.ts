import { IDegrees, NewDegrees } from './degrees.model';

export const sampleWithRequiredData: IDegrees = {
  id: 43902,
  degreeName: 'microchip input Berkshire',
};

export const sampleWithPartialData: IDegrees = {
  id: 46555,
  degreeName: 'payment schemas Granite',
};

export const sampleWithFullData: IDegrees = {
  id: 35636,
  degreeName: 'lavender Extensions',
};

export const sampleWithNewData: NewDegrees = {
  degreeName: 'transmitting bypass Montenegro',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
