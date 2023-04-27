export interface IFinalGroup {
  id: number;
  name?: string | null;
  members?: string | null;
  isAdvertised?: boolean | null;
  groupDescription?: string | null;
  pfp?: string | null;
  admins?: string | null;
}

export type NewFinalGroup = Omit<IFinalGroup, 'id'> & { id: null };
