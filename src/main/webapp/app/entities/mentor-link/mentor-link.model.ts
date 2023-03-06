import { IMentors } from 'app/entities/mentors/mentors.model';
import { IMentees } from 'app/entities/mentees/mentees.model';

export interface IMentorLink {
  id: number;
  mentor?: Pick<IMentors, 'id'> | null;
  mentee?: Pick<IMentees, 'id'> | null;
}

export type NewMentorLink = Omit<IMentorLink, 'id'> & { id: null };
