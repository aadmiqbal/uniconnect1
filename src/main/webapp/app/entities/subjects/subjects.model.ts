export interface ISubjects {
  id: number;
  subjectName?: string | null;
}

export type NewSubjects = Omit<ISubjects, 'id'> & { id: null };
