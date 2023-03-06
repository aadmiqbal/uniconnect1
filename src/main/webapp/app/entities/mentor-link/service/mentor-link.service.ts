import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMentorLink, NewMentorLink } from '../mentor-link.model';

export type PartialUpdateMentorLink = Partial<IMentorLink> & Pick<IMentorLink, 'id'>;

export type EntityResponseType = HttpResponse<IMentorLink>;
export type EntityArrayResponseType = HttpResponse<IMentorLink[]>;

@Injectable({ providedIn: 'root' })
export class MentorLinkService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mentor-links');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mentorLink: NewMentorLink): Observable<EntityResponseType> {
    return this.http.post<IMentorLink>(this.resourceUrl, mentorLink, { observe: 'response' });
  }

  update(mentorLink: IMentorLink): Observable<EntityResponseType> {
    return this.http.put<IMentorLink>(`${this.resourceUrl}/${this.getMentorLinkIdentifier(mentorLink)}`, mentorLink, {
      observe: 'response',
    });
  }

  partialUpdate(mentorLink: PartialUpdateMentorLink): Observable<EntityResponseType> {
    return this.http.patch<IMentorLink>(`${this.resourceUrl}/${this.getMentorLinkIdentifier(mentorLink)}`, mentorLink, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMentorLink>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMentorLink[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMentorLinkIdentifier(mentorLink: Pick<IMentorLink, 'id'>): number {
    return mentorLink.id;
  }

  compareMentorLink(o1: Pick<IMentorLink, 'id'> | null, o2: Pick<IMentorLink, 'id'> | null): boolean {
    return o1 && o2 ? this.getMentorLinkIdentifier(o1) === this.getMentorLinkIdentifier(o2) : o1 === o2;
  }

  addMentorLinkToCollectionIfMissing<Type extends Pick<IMentorLink, 'id'>>(
    mentorLinkCollection: Type[],
    ...mentorLinksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mentorLinks: Type[] = mentorLinksToCheck.filter(isPresent);
    if (mentorLinks.length > 0) {
      const mentorLinkCollectionIdentifiers = mentorLinkCollection.map(mentorLinkItem => this.getMentorLinkIdentifier(mentorLinkItem)!);
      const mentorLinksToAdd = mentorLinks.filter(mentorLinkItem => {
        const mentorLinkIdentifier = this.getMentorLinkIdentifier(mentorLinkItem);
        if (mentorLinkCollectionIdentifiers.includes(mentorLinkIdentifier)) {
          return false;
        }
        mentorLinkCollectionIdentifiers.push(mentorLinkIdentifier);
        return true;
      });
      return [...mentorLinksToAdd, ...mentorLinkCollection];
    }
    return mentorLinkCollection;
  }
}
