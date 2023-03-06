import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISubjects, NewSubjects } from '../subjects.model';

export type PartialUpdateSubjects = Partial<ISubjects> & Pick<ISubjects, 'id'>;

export type EntityResponseType = HttpResponse<ISubjects>;
export type EntityArrayResponseType = HttpResponse<ISubjects[]>;

@Injectable({ providedIn: 'root' })
export class SubjectsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/subjects');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(subjects: NewSubjects): Observable<EntityResponseType> {
    return this.http.post<ISubjects>(this.resourceUrl, subjects, { observe: 'response' });
  }

  update(subjects: ISubjects): Observable<EntityResponseType> {
    return this.http.put<ISubjects>(`${this.resourceUrl}/${this.getSubjectsIdentifier(subjects)}`, subjects, { observe: 'response' });
  }

  partialUpdate(subjects: PartialUpdateSubjects): Observable<EntityResponseType> {
    return this.http.patch<ISubjects>(`${this.resourceUrl}/${this.getSubjectsIdentifier(subjects)}`, subjects, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISubjects>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISubjects[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSubjectsIdentifier(subjects: Pick<ISubjects, 'id'>): number {
    return subjects.id;
  }

  compareSubjects(o1: Pick<ISubjects, 'id'> | null, o2: Pick<ISubjects, 'id'> | null): boolean {
    return o1 && o2 ? this.getSubjectsIdentifier(o1) === this.getSubjectsIdentifier(o2) : o1 === o2;
  }

  addSubjectsToCollectionIfMissing<Type extends Pick<ISubjects, 'id'>>(
    subjectsCollection: Type[],
    ...subjectsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const subjects: Type[] = subjectsToCheck.filter(isPresent);
    if (subjects.length > 0) {
      const subjectsCollectionIdentifiers = subjectsCollection.map(subjectsItem => this.getSubjectsIdentifier(subjectsItem)!);
      const subjectsToAdd = subjects.filter(subjectsItem => {
        const subjectsIdentifier = this.getSubjectsIdentifier(subjectsItem);
        if (subjectsCollectionIdentifiers.includes(subjectsIdentifier)) {
          return false;
        }
        subjectsCollectionIdentifiers.push(subjectsIdentifier);
        return true;
      });
      return [...subjectsToAdd, ...subjectsCollection];
    }
    return subjectsCollection;
  }
}
