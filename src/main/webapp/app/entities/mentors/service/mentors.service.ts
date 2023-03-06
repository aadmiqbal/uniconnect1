import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMentors, NewMentors } from '../mentors.model';

export type PartialUpdateMentors = Partial<IMentors> & Pick<IMentors, 'id'>;

export type EntityResponseType = HttpResponse<IMentors>;
export type EntityArrayResponseType = HttpResponse<IMentors[]>;

@Injectable({ providedIn: 'root' })
export class MentorsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mentors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mentors: NewMentors): Observable<EntityResponseType> {
    return this.http.post<IMentors>(this.resourceUrl, mentors, { observe: 'response' });
  }

  update(mentors: IMentors): Observable<EntityResponseType> {
    return this.http.put<IMentors>(`${this.resourceUrl}/${this.getMentorsIdentifier(mentors)}`, mentors, { observe: 'response' });
  }

  partialUpdate(mentors: PartialUpdateMentors): Observable<EntityResponseType> {
    return this.http.patch<IMentors>(`${this.resourceUrl}/${this.getMentorsIdentifier(mentors)}`, mentors, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMentors>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMentors[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMentorsIdentifier(mentors: Pick<IMentors, 'id'>): number {
    return mentors.id;
  }

  compareMentors(o1: Pick<IMentors, 'id'> | null, o2: Pick<IMentors, 'id'> | null): boolean {
    return o1 && o2 ? this.getMentorsIdentifier(o1) === this.getMentorsIdentifier(o2) : o1 === o2;
  }

  addMentorsToCollectionIfMissing<Type extends Pick<IMentors, 'id'>>(
    mentorsCollection: Type[],
    ...mentorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mentors: Type[] = mentorsToCheck.filter(isPresent);
    if (mentors.length > 0) {
      const mentorsCollectionIdentifiers = mentorsCollection.map(mentorsItem => this.getMentorsIdentifier(mentorsItem)!);
      const mentorsToAdd = mentors.filter(mentorsItem => {
        const mentorsIdentifier = this.getMentorsIdentifier(mentorsItem);
        if (mentorsCollectionIdentifiers.includes(mentorsIdentifier)) {
          return false;
        }
        mentorsCollectionIdentifiers.push(mentorsIdentifier);
        return true;
      });
      return [...mentorsToAdd, ...mentorsCollection];
    }
    return mentorsCollection;
  }
}
