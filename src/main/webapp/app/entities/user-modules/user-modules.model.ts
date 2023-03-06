export interface IUserModules {
  id: number;
  moduleName?: string | null;
  optional?: boolean | null;
  studyYear?: number | null;
}

export type NewUserModules = Omit<IUserModules, 'id'> & { id: null };
