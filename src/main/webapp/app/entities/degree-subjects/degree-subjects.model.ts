import { IDegrees } from 'app/entities/degrees/degrees.model';
import { ISubjects } from 'app/entities/subjects/subjects.model';

export interface IDegreeSubjects {
  id: number;
  degree?: Pick<IDegrees, 'id'> | null;
  subject?: Pick<ISubjects, 'id'> | null;
}

export type NewDegreeSubjects = Omit<IDegreeSubjects, 'id'> & { id: null };
