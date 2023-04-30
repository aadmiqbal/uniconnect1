import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 29027,
};

export const sampleWithPartialData: IMessage = {
  id: 85938,
  senderId: 28491,
  content: 'Oklahoma',
};

export const sampleWithFullData: IMessage = {
  id: 41952,
  senderId: 88709,
  recieverId: 76000,
  content: 'invoice',
  timestamp: dayjs('2023-04-29T16:43'),
};

export const sampleWithNewData: NewMessage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
