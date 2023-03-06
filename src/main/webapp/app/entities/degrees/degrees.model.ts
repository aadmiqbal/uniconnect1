export interface IDegrees {
  id: number;
  degreeName?: string | null;
}

export type NewDegrees = Omit<IDegrees, 'id'> & { id: null };
