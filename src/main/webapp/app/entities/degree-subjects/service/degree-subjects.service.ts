import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDegreeSubjects, NewDegreeSubjects } from '../degree-subjects.model';

export type PartialUpdateDegreeSubjects = Partial<IDegreeSubjects> & Pick<IDegreeSubjects, 'id'>;

export type EntityResponseType = HttpResponse<IDegreeSubjects>;
export type EntityArrayResponseType = HttpResponse<IDegreeSubjects[]>;

@Injectable({ providedIn: 'root' })
export class DegreeSubjectsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/degree-subjects');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(degreeSubjects: NewDegreeSubjects): Observable<EntityResponseType> {
    return this.http.post<IDegreeSubjects>(this.resourceUrl, degreeSubjects, { observe: 'response' });
  }

  update(degreeSubjects: IDegreeSubjects): Observable<EntityResponseType> {
    return this.http.put<IDegreeSubjects>(`${this.resourceUrl}/${this.getDegreeSubjectsIdentifier(degreeSubjects)}`, degreeSubjects, {
      observe: 'response',
    });
  }

  partialUpdate(degreeSubjects: PartialUpdateDegreeSubjects): Observable<EntityResponseType> {
    return this.http.patch<IDegreeSubjects>(`${this.resourceUrl}/${this.getDegreeSubjectsIdentifier(degreeSubjects)}`, degreeSubjects, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDegreeSubjects>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDegreeSubjects[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDegreeSubjectsIdentifier(degreeSubjects: Pick<IDegreeSubjects, 'id'>): number {
    return degreeSubjects.id;
  }

  compareDegreeSubjects(o1: Pick<IDegreeSubjects, 'id'> | null, o2: Pick<IDegreeSubjects, 'id'> | null): boolean {
    return o1 && o2 ? this.getDegreeSubjectsIdentifier(o1) === this.getDegreeSubjectsIdentifier(o2) : o1 === o2;
  }

  addDegreeSubjectsToCollectionIfMissing<Type extends Pick<IDegreeSubjects, 'id'>>(
    degreeSubjectsCollection: Type[],
    ...degreeSubjectsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const degreeSubjects: Type[] = degreeSubjectsToCheck.filter(isPresent);
    if (degreeSubjects.length > 0) {
      const degreeSubjectsCollectionIdentifiers = degreeSubjectsCollection.map(
        degreeSubjectsItem => this.getDegreeSubjectsIdentifier(degreeSubjectsItem)!
      );
      const degreeSubjectsToAdd = degreeSubjects.filter(degreeSubjectsItem => {
        const degreeSubjectsIdentifier = this.getDegreeSubjectsIdentifier(degreeSubjectsItem);
        if (degreeSubjectsCollectionIdentifiers.includes(degreeSubjectsIdentifier)) {
          return false;
        }
        degreeSubjectsCollectionIdentifiers.push(degreeSubjectsIdentifier);
        return true;
      });
      return [...degreeSubjectsToAdd, ...degreeSubjectsCollection];
    }
    return degreeSubjectsCollection;
  }
}
