import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMentees, NewMentees } from '../mentees.model';

export type PartialUpdateMentees = Partial<IMentees> & Pick<IMentees, 'id'>;

export type EntityResponseType = HttpResponse<IMentees>;
export type EntityArrayResponseType = HttpResponse<IMentees[]>;

@Injectable({ providedIn: 'root' })
export class MenteesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mentees');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mentees: NewMentees): Observable<EntityResponseType> {
    return this.http.post<IMentees>(this.resourceUrl, mentees, { observe: 'response' });
  }

  update(mentees: IMentees): Observable<EntityResponseType> {
    return this.http.put<IMentees>(`${this.resourceUrl}/${this.getMenteesIdentifier(mentees)}`, mentees, { observe: 'response' });
  }

  partialUpdate(mentees: PartialUpdateMentees): Observable<EntityResponseType> {
    return this.http.patch<IMentees>(`${this.resourceUrl}/${this.getMenteesIdentifier(mentees)}`, mentees, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMentees>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMentees[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMenteesIdentifier(mentees: Pick<IMentees, 'id'>): number {
    return mentees.id;
  }

  compareMentees(o1: Pick<IMentees, 'id'> | null, o2: Pick<IMentees, 'id'> | null): boolean {
    return o1 && o2 ? this.getMenteesIdentifier(o1) === this.getMenteesIdentifier(o2) : o1 === o2;
  }

  addMenteesToCollectionIfMissing<Type extends Pick<IMentees, 'id'>>(
    menteesCollection: Type[],
    ...menteesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mentees: Type[] = menteesToCheck.filter(isPresent);
    if (mentees.length > 0) {
      const menteesCollectionIdentifiers = menteesCollection.map(menteesItem => this.getMenteesIdentifier(menteesItem)!);
      const menteesToAdd = mentees.filter(menteesItem => {
        const menteesIdentifier = this.getMenteesIdentifier(menteesItem);
        if (menteesCollectionIdentifiers.includes(menteesIdentifier)) {
          return false;
        }
        menteesCollectionIdentifiers.push(menteesIdentifier);
        return true;
      });
      return [...menteesToAdd, ...menteesCollection];
    }
    return menteesCollection;
  }
}
